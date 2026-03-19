import { z } from "zod";
import { jsonStringField, optionalIsoDateString } from "./common";

export const createConflictSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(200),
  shortName: z.string().min(2).max(120),
  description: z.string().min(10),
  region: z.string().min(2).max(120),
  status: z.enum(["ACTIVE", "PAUSED", "ENDED"]),
  startDate: optionalIsoDateString,
  endDate: optionalIsoDateString,
  mainCountriesJson: jsonStringField,
  sideAJson: jsonStringField,
  sideBJson: jsonStringField,
  tagsJson: jsonStringField,
  heroLabel: z.string().max(200).optional().nullable(),
  priority: z.number().int().default(0),
  featured: z.boolean().default(false),
});

export const updateConflictSchema = createConflictSchema.partial();
