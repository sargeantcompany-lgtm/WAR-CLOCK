import type { Prisma } from "@prisma/client";
import { prisma } from "../config/db";

export const casualtyRepository = {
  findLatestByConflictId(conflictId: number) {
    return prisma.casualtyRecord.findFirst({
      where: { conflictId },
      orderBy: [{ recordDate: "desc" }, { createdAt: "desc" }],
    });
  },

  create(data: Prisma.CasualtyRecordUncheckedCreateInput) {
    return prisma.casualtyRecord.create({ data });
  },
};
