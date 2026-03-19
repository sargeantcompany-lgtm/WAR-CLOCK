import { Router } from "express";
import { publicController } from "../controllers/publicController";

export const publicRoutes = Router();

publicRoutes.get("/health", publicController.health);
publicRoutes.get("/conflicts", publicController.listConflicts);
publicRoutes.get("/conflicts/:slug", publicController.getConflict);
publicRoutes.get("/conflicts/:slug/casualties/latest", publicController.getLatestCasualties);
publicRoutes.get("/conflicts/:slug/counter", publicController.getConflictCounter);
publicRoutes.get("/global-counter", publicController.getGlobalCounter);
