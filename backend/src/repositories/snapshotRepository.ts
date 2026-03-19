import type { Prisma } from "@prisma/client";
import { prisma } from "../config/db";

export const snapshotRepository = {
  findLatestTwoByConflictId(conflictId: number) {
    return prisma.dailyCounterSnapshot.findMany({
      where: { conflictId },
      orderBy: [{ snapshotDate: "desc" }, { createdAt: "desc" }],
      take: 2,
    });
  },

  create(data: Prisma.DailyCounterSnapshotUncheckedCreateInput) {
    return prisma.dailyCounterSnapshot.create({ data });
  },

  update(id: number, data: Prisma.DailyCounterSnapshotUncheckedUpdateInput) {
    return prisma.dailyCounterSnapshot.update({
      where: { id },
      data,
    });
  },
};
