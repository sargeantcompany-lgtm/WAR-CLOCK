import type { Request, Response } from "express";
import { casualtyService } from "../services/casualtyService";
import { conflictService } from "../services/conflictService";
import { counterService } from "../services/counterService";
import { sourceService } from "../services/sourceService";
import { createCasualtyRecordSchema } from "../validators/casualtySchemas";
import {
  createConflictSchema,
  updateConflictSchema,
} from "../validators/conflictSchemas";
import { idParamSchema } from "../validators/paramsSchemas";
import {
  createSnapshotSchema,
  updateSnapshotSchema,
} from "../validators/snapshotSchemas";
import { createSourceSchema } from "../validators/sourceSchemas";

export const adminController = {
  async listConflicts(_req: Request, res: Response) {
    const conflicts = await conflictService.getAdminConflicts();
    res.json({ conflicts });
  },

  async getConflict(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const conflict = await conflictService.getAdminConflictById(id);
    res.json({ conflict });
  },

  async createConflict(req: Request, res: Response) {
    const payload = createConflictSchema.parse(req.body);
    const conflict = await conflictService.createConflict({
      ...payload,
      startDate: payload.startDate ? new Date(payload.startDate) : null,
      endDate: payload.endDate ? new Date(payload.endDate) : null,
    });
    res.status(201).json({ conflict });
  },

  async updateConflict(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const payload = updateConflictSchema.parse(req.body);
    const conflict = await conflictService.updateConflict(id, {
      ...payload,
      startDate: payload.startDate === undefined
        ? undefined
        : payload.startDate
          ? new Date(payload.startDate)
          : null,
      endDate: payload.endDate === undefined
        ? undefined
        : payload.endDate
          ? new Date(payload.endDate)
          : null,
    });
    res.json({ conflict });
  },

  async createCasualty(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const payload = createCasualtyRecordSchema.parse(req.body);
    const casualtyRecord = await casualtyService.create(id, {
      conflictId: id,
      ...payload,
      recordDate: new Date(payload.recordDate),
    });
    res.status(201).json({ casualtyRecord });
  },

  async createSource(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const payload = createSourceSchema.parse(req.body);
    const source = await sourceService.createSource(id, {
      conflictId: id,
      ...payload,
      publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : null,
      accessedAt: payload.accessedAt ? new Date(payload.accessedAt) : null,
    });
    res.status(201).json({ source });
  },

  async createSnapshot(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const payload = createSnapshotSchema.parse(req.body);
    const snapshot = await counterService.createSnapshot(id, {
      conflictId: id,
      ...payload,
      snapshotDate: new Date(payload.snapshotDate),
    });
    res.status(201).json({ snapshot });
  },

  async updateSnapshot(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const payload = updateSnapshotSchema.parse(req.body);
    const snapshot = await counterService.updateSnapshot(id, {
      ...payload,
      snapshotDate:
        payload.snapshotDate === undefined
          ? undefined
          : new Date(payload.snapshotDate),
    });
    res.json({ snapshot });
  },
};
