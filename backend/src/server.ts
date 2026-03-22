import { createApp } from "./app";
import { prisma } from "./config/db";
import { env } from "./config/env";
import { logger } from "./lib/logger";

const app = createApp();
const HOST = "0.0.0.0";
const DB_RETRY_DELAY_MS = 5000;

async function connectToDatabase() {
  try {
    await prisma.$connect();
    logger.info("Database connection established");
  } catch (error) {
    logger.error("Database connection failed; retrying soon", error);
    setTimeout(() => {
      void connectToDatabase();
    }, DB_RETRY_DELAY_MS);
  }
}

async function start() {
  app.listen(env.PORT, HOST, () => {
    logger.info(`WAR CLOCK backend listening on http://${HOST}:${env.PORT}`);
  });

  void connectToDatabase();
}

start().catch(async (error) => {
  logger.error("Failed to start server", error);
  await prisma.$disconnect();
  process.exit(1);
});
