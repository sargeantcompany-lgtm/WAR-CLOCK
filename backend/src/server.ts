import { createApp } from "./app";
import { prisma } from "./config/db";
import { env } from "./config/env";
import { logger } from "./lib/logger";

const app = createApp();

async function start() {
  await prisma.$connect();

  app.listen(env.PORT, () => {
    logger.info(`WAR CLOCK backend listening on port ${env.PORT}`);
  });
}

start().catch(async (error) => {
  logger.error("Failed to start server", error);
  await prisma.$disconnect();
  process.exit(1);
});
