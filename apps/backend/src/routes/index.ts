import { randomUUID } from "node:crypto";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import type {
  Audit,
  Branch,
  CalendarEvent,
  Company,
  Compliance,
  Department,
  DocumentRecord,
  ReportRecord,
  Risk,
  Role,
  Task,
  User,
  Vendor
} from "../../../../shared/domain.js";
import { authController } from "../controllers/auth-controller.js";
import { dashboardController } from "../controllers/dashboard-controller.js";
import { documentController } from "../controllers/document-controller.js";
import { EntityController } from "../controllers/entity-controller.js";
import { reportController } from "../controllers/report-controller.js";
import { settingsController } from "../controllers/settings-controller.js";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { authenticateToken, requirePermission } from "../middlewares/authenticate.js";
import { PrismaRepository } from "../repositories/prisma-repository.js";
import { EntityService } from "../services/entity-service.js";
import { buildEntityRouter } from "./entity-route.js";
import type { Resource } from "../../../../shared/permissions.js";
import { auditSubRouter } from "./audit-sub-route.js";
import { exportRouter } from "./export-route.js";
import { leadRouter } from "./lead-route.js";
import { serializeRecord } from "../utils/serialize.js";

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, env.uploadDir),
    filename: (_req, file, callback) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
      callback(null, `${Date.now()}-${safeName}`);
    }
  })
});

type ModelKey =
  | "role"
  | "user"
  | "company"
  | "branch"
  | "department"
  | "compliance"
  | "task"
  | "calendarEvent"
  | "audit"
  | "risk"
  | "vendor"
  | "reportRecord";

function buildRepo<T extends { id: string }>(model: ModelKey) {
  return new PrismaRepository<T, any, any>(prisma[model] as any);
}

function entityRouter<T extends { id: string }>(model: ModelKey, resource: Resource) {
  return buildEntityRouter(
    new EntityController(new EntityService(buildRepo<T>(model))),
    resource
  );
}

export const apiRouter = Router();

apiRouter.post("/auth/login", authController.login);
apiRouter.use("/leads", leadRouter);
apiRouter.use(authenticateToken);
apiRouter.get("/auth/me", authController.me);

apiRouter.get("/dashboard", requirePermission("dashboard", "read"), dashboardController.summary);
apiRouter.get("/notifications", requirePermission("dashboard", "read"), async (_req, res) => {
  const notifications = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 10 });
  res.json({ success: true, data: serializeRecord(notifications) });
});
apiRouter.get("/reports/summary", requirePermission("reports", "read"), reportController.summary);
apiRouter.use("/reports/export", requirePermission("reports", "read"), exportRouter);

apiRouter.get("/settings", requirePermission("settings", "read"), settingsController.list);
apiRouter.put("/settings", requirePermission("settings", "write"), settingsController.update);

apiRouter.use("/users", entityRouter<User>("user", "users"));
apiRouter.use("/roles", entityRouter<Role>("role", "roles"));
apiRouter.use("/companies", entityRouter<Company>("company", "companies"));
apiRouter.use("/branches", entityRouter<Branch>("branch", "branches"));
apiRouter.use("/departments", entityRouter<Department>("department", "departments"));
apiRouter.use("/compliances", entityRouter<Compliance>("compliance", "compliances"));
apiRouter.use("/tasks", entityRouter<Task>("task", "tasks"));
apiRouter.use("/calendar", entityRouter<CalendarEvent>("calendarEvent", "calendar"));
apiRouter.use("/audits/:auditId", requirePermission("audits", "read"), auditSubRouter);
apiRouter.use("/audits", entityRouter<Audit>("audit", "audits"));
apiRouter.use("/risks", entityRouter<Risk>("risk", "risks"));
apiRouter.use("/vendors", entityRouter<Vendor>("vendor", "vendors"));
apiRouter.use("/reports", entityRouter<ReportRecord>("reportRecord", "reports"));

const canReadDocs = requirePermission("documents", "read");
const canWriteDocs = requirePermission("documents", "write");

apiRouter.get("/documents", canReadDocs, documentController.list);
apiRouter.get("/documents/:id", canReadDocs, documentController.get);
apiRouter.post("/documents", canWriteDocs, upload.single("file"), documentController.create);
apiRouter.put("/documents/:id", canWriteDocs, documentController.update);
apiRouter.delete("/documents/:id", canWriteDocs, documentController.remove);
