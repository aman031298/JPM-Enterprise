import type { Request, Response } from "express";
import { ReportService } from "../services/report-service.js";

const reportService = new ReportService();

export const reportController = {
  summary: async (_req: Request, res: Response) => {
    const data = await reportService.getReportDashboard();
    res.json({ success: true, data });
  }
};
