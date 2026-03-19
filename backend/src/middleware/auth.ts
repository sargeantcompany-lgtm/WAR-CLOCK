import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

export function requireAdminToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.header("x-admin-token");

  if (!token || token !== env.ADMIN_TOKEN) {
    return res.status(401).json({
      error: {
        message: "Unauthorized",
      },
    });
  }

  req.adminAuthorized = true;
  next();
}
