import { z } from "zod";
import { optionalIsoDateString } from "./common";

export const createSourceSchema = z.object({
  sourceType: z.enum(["UN", "NGO", "GOVERNMENT", "MEDIA", "ACADEMIC", "OTHER"]),
  title: z.string().min(3).max(250),
  publisher: z.string().min(2).max(180),
  url: z.string().url(),
  publishedAt: optionalIsoDateString,
  accessedAt: optionalIsoDateString,
  reliabilityScore: z.number().int().min(1).max(5).optional().nullable(),
  notes: z.string().optional().nullable(),
});
