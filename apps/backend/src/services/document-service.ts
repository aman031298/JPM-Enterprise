import path from "node:path";
import { randomUUID } from "node:crypto";
import type { DocumentRecord } from "../../../../shared/domain.js";
import { prisma } from "../lib/prisma.js";
import { serializeRecord } from "../utils/serialize.js";
import { NotificationService } from "./notification-service.js";

function getDocumentStatus(expiryDate: Date): "Valid" | "Expiring" | "Expired" {
  const now = Date.now();
  const diffDays = Math.ceil((expiryDate.getTime() - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Expired";
  }

  if (diffDays <= 30) {
    return "Expiring";
  }

  return "Valid";
}

export class DocumentService {
  private readonly notifications = new NotificationService();

  async list() {
    const records = await prisma.documentRecord.findMany({ orderBy: { createdAt: "desc" } });
    return serializeRecord(records) as unknown as DocumentRecord[];
  }

  async get(id: string) {
    const record = await prisma.documentRecord.findUnique({ where: { id } });
    return record ? (serializeRecord(record) as unknown as DocumentRecord) : null;
  }

  async create(payload: {
    title: string;
    category: string;
    owner: string;
    expiryDate: string;
    file?: Express.Multer.File;
  }) {
    const expiryDate = new Date(payload.expiryDate);
    const status = getDocumentStatus(expiryDate);
    const timestamp = new Date();

    const record = await prisma.documentRecord.create({
      data: {
        id: randomUUID(),
        createdAt: timestamp,
        updatedAt: timestamp,
        title: payload.title,
        category: payload.category,
        owner: payload.owner,
        expiryDate,
        status,
        fileName: payload.file?.originalname ?? null,
        filePath: payload.file ? `/uploads/${path.basename(payload.file.path)}` : null,
        mimeType: payload.file?.mimetype ?? null,
        size: payload.file?.size ?? null
      }
    });

    await this.notifications.createAndSend({
      title: `Document uploaded: ${payload.title}`,
      description: `${payload.owner} uploaded ${payload.title}. Current status: ${status}.`,
      severity: status === "Expired" ? "Critical" : status === "Expiring" ? "Warning" : "Info"
    });

    return serializeRecord(record) as unknown as DocumentRecord;
  }

  async update(id: string, payload: Partial<DocumentRecord>) {
    try {
      const record = await prisma.documentRecord.update({
        where: { id },
        data: {
          ...payload,
          expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : undefined,
          updatedAt: new Date()
        }
      });
      return serializeRecord(record) as unknown as DocumentRecord;
    } catch {
      return null;
    }
  }

  async remove(id: string) {
    try {
      await prisma.documentRecord.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
