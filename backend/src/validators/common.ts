import { z } from "zod";

export const isoDateString = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

export const optionalIsoDateString = isoDateString.optional().nullable();

export const jsonStringField = z.string().min(2);
