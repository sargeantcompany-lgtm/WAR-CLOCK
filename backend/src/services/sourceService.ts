import type { Prisma } from "@prisma/client";
import { AppError } from "../lib/appError";
import { conflictRepository } from "../repositories/conflictRepository";
import { sourceRepository } from "../repositories/sourceRepository";

export const sourceService = {
  async createSource(conflictId: number, data: Prisma.SourceUncheckedCreateInput) {
    const conflict = await conflictRepository.findConflictById(conflictId);

    if (!conflict) {
      throw new AppError(404, "Conflict not found");
    }

    return sourceRepository.create(data);
  },
};
