import type { Prisma } from "@prisma/client";
import { prisma } from "../config/db";

export const sourceRepository = {
  create(data: Prisma.SourceUncheckedCreateInput) {
    return prisma.source.create({ data });
  },
};
