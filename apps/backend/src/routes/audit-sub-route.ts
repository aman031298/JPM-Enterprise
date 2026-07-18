import { Router, type Request, type Response } from "express";
import multer from "multer";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { requirePermission } from "../middlewares/authenticate.js";
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

const canWrite = requirePermission("audits", "write");

type AuditParams = { auditId: string };
type AuditItemParams = AuditParams & { itemId: string };
type AuditFindingParams = AuditParams & { findingId: string };
type AuditEvidenceParams = AuditParams & { evidenceId: string };

export const auditSubRouter = Router({ mergeParams: true });

// Checklist items
auditSubRouter.get("/checklist", async (req: Request<AuditParams>, res: Response) => {
  const items = await prisma.checklistItem.findMany({
    where: { auditId: req.params.auditId },
    orderBy: { createdAt: "asc" }
  });
  res.json({ success: true, data: serializeRecord(items) });
});

auditSubRouter.post("/checklist", canWrite, async (req: Request<AuditParams>, res: Response) => {
  const item = await prisma.checklistItem.create({
    data: { auditId: req.params.auditId, label: req.body.label, done: Boolean(req.body.done) }
  });
  res.status(201).json({ success: true, data: serializeRecord(item) });
});

auditSubRouter.put("/checklist/:itemId", canWrite, async (req: Request<AuditItemParams>, res: Response) => {
  try {
    const item = await prisma.checklistItem.update({
      where: { id: req.params.itemId },
      data: {
        ...(req.body.label !== undefined ? { label: req.body.label } : {}),
        ...(req.body.done !== undefined ? { done: Boolean(req.body.done) } : {})
      }
    });
    res.json({ success: true, data: serializeRecord(item) });
  } catch {
    res.status(404).json({ success: false, message: "Checklist item not found" });
  }
});

auditSubRouter.delete("/checklist/:itemId", canWrite, async (req: Request<AuditItemParams>, res: Response) => {
  try {
    await prisma.checklistItem.delete({ where: { id: req.params.itemId } });
    res.status(204).send();
  } catch {
    res.status(404).json({ success: false, message: "Checklist item not found" });
  }
});

// Findings
auditSubRouter.get("/findings", async (req: Request<AuditParams>, res: Response) => {
  const items = await prisma.finding.findMany({
    where: { auditId: req.params.auditId },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, data: serializeRecord(items) });
});

auditSubRouter.post("/findings", canWrite, async (req: Request<AuditParams>, res: Response) => {
  const item = await prisma.finding.create({
    data: {
      auditId: req.params.auditId,
      description: req.body.description,
      severity: req.body.severity,
      status: req.body.status ?? "Open"
    }
  });
  res.status(201).json({ success: true, data: serializeRecord(item) });
});

auditSubRouter.put("/findings/:findingId", canWrite, async (req: Request<AuditFindingParams>, res: Response) => {
  try {
    const item = await prisma.finding.update({
      where: { id: req.params.findingId },
      data: {
        ...(req.body.description !== undefined ? { description: req.body.description } : {}),
        ...(req.body.severity !== undefined ? { severity: req.body.severity } : {}),
        ...(req.body.status !== undefined ? { status: req.body.status } : {})
      }
    });
    res.json({ success: true, data: serializeRecord(item) });
  } catch {
    res.status(404).json({ success: false, message: "Finding not found" });
  }
});

auditSubRouter.delete("/findings/:findingId", canWrite, async (req: Request<AuditFindingParams>, res: Response) => {
  try {
    await prisma.finding.delete({ where: { id: req.params.findingId } });
    res.status(204).send();
  } catch {
    res.status(404).json({ success: false, message: "Finding not found" });
  }
});

// Evidence
auditSubRouter.get("/evidence", async (req: Request<AuditParams>, res: Response) => {
  const items = await prisma.evidence.findMany({
    where: { auditId: req.params.auditId },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, data: serializeRecord(items) });
});

auditSubRouter.post(
  "/evidence",
  canWrite,
  upload.single("file"),
  async (req: Request<AuditParams>, res: Response) => {
    const item = await prisma.evidence.create({
      data: {
        auditId: req.params.auditId,
        title: req.body.title,
        fileName: req.file?.originalname ?? null,
        filePath: req.file?.path ?? null,
        mimeType: req.file?.mimetype ?? null,
        size: req.file?.size ?? null
      }
    });
    res.status(201).json({ success: true, data: serializeRecord(item) });
  }
);

auditSubRouter.delete("/evidence/:evidenceId", canWrite, async (req: Request<AuditEvidenceParams>, res: Response) => {
  try {
    await prisma.evidence.delete({ where: { id: req.params.evidenceId } });
    res.status(204).send();
  } catch {
    res.status(404).json({ success: false, message: "Evidence not found" });
  }
});
