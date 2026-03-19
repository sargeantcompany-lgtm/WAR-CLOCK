import { z } from "zod";
import { isoDateString } from "./common";

const optionalNumber = z.number().int().nonnegative().optional().nullable();

export const createSnapshotSchema = z.object({
  snapshotDate: isoDateString,
  displayedKilledTotal: z.number().int().nonnegative(),
  displayedInjuredTotal: optionalNumber,
  dailyIncreaseKilled: optionalNumber,
  dailyIncreaseInjured: optionalNumber,
  smoothingHours: z.number().int().positive().default(24),
});

export const updateSnapshotSchema = createSnapshotSchema.partial();
