import type { Request, Response } from "express";
import { EntityService } from "../services/entity-service.js";

export class EntityController<T extends { id: string }, TCreate extends object, TUpdate extends object> {
  constructor(private readonly service: EntityService<T, TCreate, TUpdate>) {}

  list = async (_req: Request, res: Response) => {
    const records = await this.service.list();
    res.json({ success: true, data: records });
  };

  get = async (req: Request, res: Response) => {
    const record = await this.service.get(String(req.params.id));
    if (!record) {
      res.status(404).json({ success: false, message: "Record not found" });
      return;
    }

    res.json({ success: true, data: record });
  };

  create = async (req: Request, res: Response) => {
    const created = await this.service.create(req.body as TCreate);
    res.status(201).json({ success: true, data: created });
  };

  update = async (req: Request, res: Response) => {
    const updated = await this.service.update(String(req.params.id), req.body as TUpdate);
    if (!updated) {
      res.status(404).json({ success: false, message: "Record not found" });
      return;
    }

    res.json({ success: true, data: updated });
  };

  remove = async (req: Request, res: Response) => {
    const removed = await this.service.remove(String(req.params.id));
    if (!removed) {
      res.status(404).json({ success: false, message: "Record not found" });
      return;
    }

    res.status(204).send();
  };
}
