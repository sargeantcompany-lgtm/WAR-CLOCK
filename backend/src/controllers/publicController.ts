import type { Request, Response } from "express";
import { casualtyService } from "../services/casualtyService";
import { conflictService } from "../services/conflictService";
import { counterService } from "../services/counterService";
import { slugParamSchema } from "../validators/paramsSchemas";

export const publicController = {
  health(_req: Request, res: Response) {
    res.json({
      status: "ok",
      service: "war-clock-backend",
    });
  },

  async listConflicts(_req: Request, res: Response) {
    const conflicts = await conflictService.getPublicConflicts();
    res.json({ conflicts });
  },

  async getConflict(req: Request, res: Response) {
    const { slug } = slugParamSchema.parse(req.params);
    const conflict = await conflictService.getConflictBySlug(slug);
    res.json({ conflict });
  },

  async getLatestCasualties(req: Request, res: Response) {
    const { slug } = slugParamSchema.parse(req.params);
    const payload = await casualtyService.getLatestBySlug(slug);
    res.json(payload);
  },

  async getConflictCounter(req: Request, res: Response) {
    const { slug } = slugParamSchema.parse(req.params);
    const payload = await counterService.getLatestCounterBySlug(slug);
    res.json(payload);
  },

  async getGlobalCounter(_req: Request, res: Response) {
    const payload = await counterService.getGlobalCounter();
    res.json(payload);
  },
};
