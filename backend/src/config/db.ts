import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "./databaseUrl";

declare global {
  var __warClockPrisma__: PrismaClient | undefined;
}

export const prisma =
  global.__warClockPrisma__ ??
  new PrismaClient({
    datasourceUrl: getDatabaseUrl(),
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__warClockPrisma__ = prisma;
}
