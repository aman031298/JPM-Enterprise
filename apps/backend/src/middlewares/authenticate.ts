import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { hasPermission, type Action, type Resource } from "../../../../shared/permissions.js";

export interface JwtClaims {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AuthenticatedRequest extends Request {
  auth?: JwtClaims;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ success: false, message: "Missing bearer token" });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtClaims;
    (req as AuthenticatedRequest).auth = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export function requirePermission(resource: Resource, action: Action) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as AuthenticatedRequest).auth;
    const permissions = auth?.permissions ?? [];

    if (!hasPermission(permissions, resource, action)) {
      res.status(403).json({ success: false, message: "Insufficient permissions" });
      return;
    }

    next();
  };
}
