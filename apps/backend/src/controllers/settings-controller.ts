import type { Request, Response } from "express";
import { SettingsService } from "../services/settings-service.js";

const settingsService = new SettingsService();

export const settingsController = {
  list: async (_req: Request, res: Response) => {
    const data = await settingsService.getSettings();
    res.json({ success: true, data });
  },
  update: async (req: Request, res: Response) => {
    const data = await settingsService.updateSettings(req.body);
    res.json({ success: true, data });
  }
};
