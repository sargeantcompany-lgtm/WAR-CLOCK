import { z } from "zod";
import { isoDateString } from "./common";

const nullableNumber = z.number().int().nonnegative().optional().nullable();

export const createCasualtyRecordSchema = z.object({
  recordDate: isoDateString,
  killedMin: nullableNumber,
  killedMax: nullableNumber,
  killedBest: nullableNumber,
  injuredMin: nullableNumber,
  injuredMax: nullableNumber,
  injuredBest: nullableNumber,
  civilianKilledMin: nullableNumber,
  civilianKilledMax: nullableNumber,
  civilianKilledBest: nullableNumber,
  childKilledMin: nullableNumber,
  childKilledMax: nullableNumber,
  childKilledBest: nullableNumber,
  notes: z.string().optional().nullable(),
  sourceSummary: z.string().optional().nullable(),
});
