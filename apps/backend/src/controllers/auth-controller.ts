import type { Request, Response } from "express";
import { AuthService } from "../services/auth-service.js";
import type { AuthenticatedRequest } from "../middlewares/authenticate.js";

const authService = new AuthService();

export const authController = {
  login: async (req: Request, res: Response) => {
    const session = await authService.login(req.body);
    if (!session) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    res.json({ success: true, data: session });
  },
  me: async (req: Request, res: Response) => {
    const session = await authService.getSession((req as AuthenticatedRequest).auth!.userId);
    if (!session) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: session });
  }
};
