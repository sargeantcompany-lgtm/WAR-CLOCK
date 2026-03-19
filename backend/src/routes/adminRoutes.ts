import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { requireAdminToken } from "../middleware/auth";

export const adminRoutes = Router();

adminRoutes.use(requireAdminToken);

adminRoutes.get("/conflicts", adminController.listConflicts);
adminRoutes.get("/conflicts/:id", adminController.getConflict);
adminRoutes.post("/conflicts", adminController.createConflict);
adminRoutes.put("/conflicts/:id", adminController.updateConflict);
adminRoutes.post("/conflicts/:id/casualties", adminController.createCasualty);
adminRoutes.post("/conflicts/:id/sources", adminController.createSource);
adminRoutes.post("/conflicts/:id/snapshots", adminController.createSnapshot);
adminRoutes.put("/snapshots/:id", adminController.updateSnapshot);
