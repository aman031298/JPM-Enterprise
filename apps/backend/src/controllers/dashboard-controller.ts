import type { Response } from "express";
import { DashboardService } from "../services/dashboard-service.js";
import type { AuthenticatedRequest } from "../middlewares/authenticate.js";

const dashboardService = new DashboardService();

export const dashboardController = {
  summary: async (req: AuthenticatedRequest, res: Response) => {
    const permissions = req.auth?.permissions ?? [];
    const data = await dashboardService.getSummary(permissions);
    res.json({ success: true, data });
  }
};
