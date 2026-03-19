import type { Prisma } from "@prisma/client";
import { AppError } from "../lib/appError";
import { buildDocumentedCounterPayload } from "../lib/counterPayload";
import { conflictRepository } from "../repositories/conflictRepository";

function parseJsonField(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function mapLatestCasualties(record?: {
  id: number;
  recordDate: Date;
  killedBest: number | null;
  injuredBest: number | null;
  civilianKilledBest: number | null;
  childKilledBest: number | null;
  sourceSummary: string | null;
  updatedAt: Date;
}) {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    recordDate: record.recordDate,
    killedBest: record.killedBest,
    injuredBest: record.injuredBest,
    civilianKilledBest: record.civilianKilledBest,
    childKilledBest: record.childKilledBest,
    sourceSummary: record.sourceSummary,
    updatedAt: record.updatedAt,
  };
}

function mapPublicConflictListItem(
  conflict: Awaited<ReturnType<typeof conflictRepository.findActivePublicConflicts>>[number],
) {
  const latestCasualty = conflict.casualtyRecords[0];
  const latestSnapshot = conflict.dailyCounterSnapshots[0];
  const previousSnapshot = conflict.dailyCounterSnapshots[1];

  return {
    id: conflict.id,
    slug: conflict.slug,
    name: conflict.name,
    shortName: conflict.shortName,
    description: conflict.description,
    region: conflict.region,
    status: conflict.status,
    featured: conflict.featured,
    priority: conflict.priority,
    latestCasualties: mapLatestCasualties(latestCasualty),
    latestCounter: buildDocumentedCounterPayload(
      latestSnapshot,
      previousSnapshot,
      latestCasualty,
    ),
  };
}

export const conflictService = {
  async getPublicConflicts() {
    const conflicts = await conflictRepository.findActivePublicConflicts();
    return conflicts.map(mapPublicConflictListItem);
  },

  async getConflictBySlug(slug: string) {
    const conflict = await conflictRepository.findPublicConflictBySlug(slug);

    if (!conflict) {
      throw new AppError(404, "Conflict not found");
    }

    const latestSnapshot = conflict.dailyCounterSnapshots[0];
    const previousSnapshot = conflict.dailyCounterSnapshots[1];

    return {
      ...mapPublicConflictListItem({
        ...conflict,
        casualtyRecords: conflict.casualtyRecords,
        dailyCounterSnapshots: conflict.dailyCounterSnapshots,
      }),
      startDate: conflict.startDate,
      endDate: conflict.endDate,
      mainCountries: parseJsonField(conflict.mainCountriesJson),
      sideA: parseJsonField(conflict.sideAJson),
      sideB: parseJsonField(conflict.sideBJson),
      tags: parseJsonField(conflict.tagsJson),
      heroLabel: conflict.heroLabel,
      latestCounter: buildDocumentedCounterPayload(
        latestSnapshot,
        previousSnapshot,
        conflict.casualtyRecords[0],
      ),
      sources: conflict.sources.map((source) => ({
        id: source.id,
        sourceType: source.sourceType,
        title: source.title,
        publisher: source.publisher,
        url: source.url,
        publishedAt: source.publishedAt,
        accessedAt: source.accessedAt,
        reliabilityScore: source.reliabilityScore,
        notes: source.notes,
        updatedAt: source.updatedAt,
      })),
      casualtyRecords: conflict.casualtyRecords.map((record) => ({
        id: record.id,
        recordDate: record.recordDate,
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
      })),
    };
  },

  async getAdminConflicts() {
    return conflictRepository.findAdminConflicts();
  },

  async getAdminConflictById(id: number) {
    const conflict = await conflictRepository.findConflictById(id);

    if (!conflict) {
      throw new AppError(404, "Conflict not found");
    }

    return conflict;
  },

  async createConflict(data: Prisma.ConflictUncheckedCreateInput) {
    return conflictRepository.create(data);
  },

  async updateConflict(id: number, data: Prisma.ConflictUncheckedUpdateInput) {
    await this.getAdminConflictById(id);
    return conflictRepository.update(id, data);
  },
};
