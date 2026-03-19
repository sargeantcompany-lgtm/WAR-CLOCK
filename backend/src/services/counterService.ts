import { prisma } from "../config/db";
import { AppError } from "../lib/appError";
import {
  buildDocumentedCounterPayload,
  getCounterDisclaimer,
  getDefaultSmoothingHours,
} from "../lib/counterPayload";
import { conflictRepository } from "../repositories/conflictRepository";
import { snapshotRepository } from "../repositories/snapshotRepository";

export const counterService = {
  async getLatestCounterBySlug(slug: string) {
    const conflict = await conflictRepository.findPublicConflictBySlug(slug);

    if (!conflict) {
      throw new AppError(404, "Conflict not found");
    }

    const latestSnapshot = conflict.dailyCounterSnapshots[0] ?? null;
    const previousSnapshot = conflict.dailyCounterSnapshots[1] ?? null;
    const latestCasualty = conflict.casualtyRecords[0] ?? null;

    return {
      conflict: {
        id: conflict.id,
        slug: conflict.slug,
        name: conflict.name,
        shortName: conflict.shortName,
      },
      counter: buildDocumentedCounterPayload(
        latestSnapshot,
        previousSnapshot,
        latestCasualty,
      ),
    };
  },

  async getGlobalCounter() {
    const conflicts = await prisma.conflict.findMany({
      where: { status: "ACTIVE" },
      include: {
        casualtyRecords: {
          orderBy: [{ recordDate: "desc" }, { createdAt: "desc" }],
          take: 1,
        },
        dailyCounterSnapshots: {
          orderBy: [{ snapshotDate: "desc" }, { createdAt: "desc" }],
          take: 2,
        },
      },
    });

    const totals = conflicts.reduce(
      (acc, conflict) => {
        const latest = conflict.dailyCounterSnapshots[0];
        const previous = conflict.dailyCounterSnapshots[1];
        const latestCasualty = conflict.casualtyRecords[0];
        const payload = buildDocumentedCounterPayload(latest, previous, latestCasualty);

        if (!payload) {
          return acc;
        }

        acc.documentedTotal += payload.documentedTotal;
        acc.previousDisplayedTotal += payload.previousDisplayedTotal;
        acc.documentedIncrease += payload.documentedIncrease;
        acc.isRevision = acc.isRevision || payload.isRevision;
        acc.activeConflicts += 1;
        acc.lastUpdatedAt =
          !acc.lastUpdatedAt || (payload.lastUpdatedAt && payload.lastUpdatedAt > acc.lastUpdatedAt)
            ? payload.lastUpdatedAt
            : acc.lastUpdatedAt;
        acc.smoothingWindowHours = Math.max(
          acc.smoothingWindowHours,
          payload.smoothingWindowHours,
        );

        return acc;
      },
      {
        documentedTotal: 0,
        previousDisplayedTotal: 0,
        documentedIncrease: 0,
        activeConflicts: 0,
        lastUpdatedAt: null as Date | null,
        smoothingWindowHours: getDefaultSmoothingHours(),
        isRevision: false,
      },
    );

    return {
      ...totals,
      displayMode: "documented-smoothed" as const,
      disclaimer: getCounterDisclaimer(),
    };
  },

  async createSnapshot(
    conflictId: number,
    data: Parameters<typeof snapshotRepository.create>[0],
  ) {
    const conflict = await conflictRepository.findConflictById(conflictId);

    if (!conflict) {
      throw new AppError(404, "Conflict not found");
    }

    return snapshotRepository.create(data);
  },

  async updateSnapshot(id: number, data: Parameters<typeof snapshotRepository.update>[1]) {
    return snapshotRepository.update(id, data);
  },
};
