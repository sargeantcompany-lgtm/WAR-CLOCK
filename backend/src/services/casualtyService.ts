import type { Prisma } from "@prisma/client";
import { AppError } from "../lib/appError";
import { casualtyRepository } from "../repositories/casualtyRepository";
import { conflictRepository } from "../repositories/conflictRepository";

function mapCasualtyRecord(
  record: Awaited<ReturnType<typeof casualtyRepository.findLatestByConflictId>>,
) {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    recordDate: record.recordDate,
    allDeathsBest: record.killedBest,
    officialDeathsBest: record.civilianKilledBest,
    killedMin: record.killedMin,
    killedMax: record.killedMax,
    killedBest: record.killedBest,
    injuredMin: record.injuredMin,
    injuredMax: record.injuredMax,
    injuredBest: record.injuredBest,
    civilianKilledMin: record.civilianKilledMin,
    civilianKilledMax: record.civilianKilledMax,
    civilianKilledBest: record.civilianKilledBest,
    childKilledMin: record.childKilledMin,
    childKilledMax: record.childKilledMax,
    childKilledBest: record.childKilledBest,
    notes: record.notes,
    sourceSummary: record.sourceSummary,
    updatedAt: record.updatedAt,
  };
}

export const casualtyService = {
  async getLatestBySlug(slug: string) {
    const conflict = await conflictRepository.findPublicConflictBySlug(slug);

    if (!conflict) {
      throw new AppError(404, "Conflict not found");
    }

    const latestRecord = conflict.casualtyRecords[0] ?? null;

    return {
      conflict: {
        id: conflict.id,
        slug: conflict.slug,
        name: conflict.name,
        shortName: conflict.shortName,
      },
      latestCasualty: mapCasualtyRecord(latestRecord),
    };
  },

  async create(conflictId: number, data: Prisma.CasualtyRecordUncheckedCreateInput) {
    const conflict = await conflictRepository.findConflictById(conflictId);

    if (!conflict) {
      throw new AppError(404, "Conflict not found");
    }

    return casualtyRepository.create(data);
  },
};
