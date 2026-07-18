import type { Request, Response } from "express";
import { DocumentService } from "../services/document-service.js";

const documentService = new DocumentService();

export const documentController = {
  list: async (_req: Request, res: Response) => {
    const data = await documentService.list();
    res.json({ success: true, data });
  },
  get: async (req: Request, res: Response) => {
    const data = await documentService.get(String(req.params.id));
    if (!data) {
      res.status(404).json({ success: false, message: "Record not found" });
      return;
    }
    res.json({ success: true, data });
  },
  create: async (req: Request, res: Response) => {
    const data = await documentService.create({
      title: req.body.title,
      category: req.body.category,
      owner: req.body.owner,
      expiryDate: req.body.expiryDate,
      file: req.file
    });
    res.status(201).json({ success: true, data });
  },
  update: async (req: Request, res: Response) => {
    const data = await documentService.update(String(req.params.id), req.body);
    if (!data) {
      res.status(404).json({ success: false, message: "Record not found" });
      return;
    }
    res.json({ success: true, data });
  },
  remove: async (req: Request, res: Response) => {
    const removed = await documentService.remove(String(req.params.id));
    if (!removed) {
      res.status(404).json({ success: false, message: "Record not found" });
      return;
    }
    res.status(204).send();
  }
};
