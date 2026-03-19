import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";
import { AppError } from "../lib/appError";
import { logger } from "../lib/logger";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Validation failed",
        details: error.flatten(),
      },
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details,
      },
    });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    return res.status(400).json({
      error: {
        message: "Database request failed",
        details: error.message,
      },
    });
  }

  logger.error("Unhandled error", error);

  return res.status(500).json({
    error: {
      message: "Internal server error",
      details: env.NODE_ENV === "production" ? undefined : String(error),
    },
  });
}
