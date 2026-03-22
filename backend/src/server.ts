import express from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { logger } from "./lib/logger";

const HOST = "0.0.0.0";
const DB_RETRY_DELAY_MS = 5000;
const port = Number(process.env.PORT ?? 8080);
const execFileAsync = promisify(execFile);

let appReady = false;
let dbReady = false;
let startupError: string | null = null;

const app = express();

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "war-clock-backend",
    appReady,
    dbReady,
    startupError,
  });
});

app.use((req, res, next) => {
  if (!appReady && req.path !== "/api/health") {
    return res.status(503).json({
      error: {
        message: "Application is still starting",
      },
    });
  }

  return next();
});

async function connectToDatabase(prisma: { $connect: () => Promise<void> }) {
  try {
    await prisma.$connect();
    dbReady = true;
    logger.info("Database connection established");
  } catch (error) {
    dbReady = false;
    startupError = error instanceof Error ? error.message : "Database connection failed";
    logger.error("Database connection failed; retrying soon", error);
    setTimeout(() => {
      void connectToDatabase(prisma);
    }, DB_RETRY_DELAY_MS);
  }
}

async function initializeApplication() {
  try {
    const [{ createApp }, { prisma }, { seedBootstrapData }] = await Promise.all([
      import("./app"),
      import("./config/db"),
      import("./lib/bootstrapSeed"),
    ]);

    try {
      await execFileAsync("npx", ["prisma", "migrate", "deploy"], {
        cwd: process.cwd(),
        env: process.env,
      });
      logger.info("Prisma migrations applied");
    } catch (error) {
      logger.error("Prisma migrate deploy failed; continuing startup", error);
    }

    try {
      const didSeed = await seedBootstrapData(prisma);
      if (didSeed) {
        logger.info("Bootstrap seed applied");
      }
    } catch (error) {
      logger.error("Bootstrap seed failed; continuing startup", error);
    }

    app.use(createApp());
    appReady = true;
    startupError = null;
    logger.info("Application routes mounted");
    void connectToDatabase(prisma);
  } catch (error) {
    appReady = false;
    startupError = error instanceof Error ? error.message : "Application failed to initialize";
    logger.error("Application initialization failed", error);
  }
}

async function start() {
  app.listen(port, HOST, () => {
    logger.info(`WAR CLOCK backend listening on http://${HOST}:${port}`);
  });

  void initializeApplication();
}

start().catch(async (error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});
