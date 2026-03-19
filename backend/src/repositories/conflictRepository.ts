import type { Prisma } from "@prisma/client";
import { prisma } from "../config/db";

const publicInclude = {
  casualtyRecords: {
    orderBy: [{ recordDate: "desc" as const }, { createdAt: "desc" as const }],
    take: 1,
  },
  dailyCounterSnapshots: {
    orderBy: [{ snapshotDate: "desc" as const }, { createdAt: "desc" as const }],
    take: 2,
  },
} satisfies Prisma.ConflictInclude;

export const conflictRepository = {
  findActivePublicConflicts() {
    return prisma.conflict.findMany({
      where: { status: "ACTIVE" },
      include: publicInclude,
      orderBy: [{ featured: "desc" }, { priority: "desc" }, { name: "asc" }],
    });
  },

  findPublicConflictBySlug(slug: string) {
    return prisma.conflict.findUnique({
      where: { slug },
      include: {
        casualtyRecords: {
          orderBy: [{ recordDate: "desc" }, { createdAt: "desc" }],
          take: 10,
        },
        sources: {
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          take: 10,
        },
        dailyCounterSnapshots: {
          orderBy: [{ snapshotDate: "desc" }, { createdAt: "desc" }],
          take: 2,
        },
      },
    });
  },

  findAdminConflicts() {
    return prisma.conflict.findMany({
      include: {
        casualtyRecords: {
          orderBy: [{ recordDate: "desc" }, { createdAt: "desc" }],
          take: 1,
        },
        dailyCounterSnapshots: {
          orderBy: [{ snapshotDate: "desc" }, { createdAt: "desc" }],
          take: 1,
        },
      },
      orderBy: [{ featured: "desc" }, { priority: "desc" }, { updatedAt: "desc" }],
    });
  },

  findConflictById(id: number) {
    return prisma.conflict.findUnique({
      where: { id },
      include: {
        casualtyRecords: {
          orderBy: [{ recordDate: "desc" }, { createdAt: "desc" }],
        },
        sources: {
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        },
        dailyCounterSnapshots: {
          orderBy: [{ snapshotDate: "desc" }, { createdAt: "desc" }],
        },
      },
    });
  },

  create(data: Prisma.ConflictUncheckedCreateInput) {
    return prisma.conflict.create({ data });
  },

  update(id: number, data: Prisma.ConflictUncheckedUpdateInput) {
    return prisma.conflict.update({
      where: { id },
      data,
    });
  },
};
