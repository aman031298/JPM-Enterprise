import { serializeRecord } from "../utils/serialize.js";

type Delegate = {
  findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  findUnique: (args: Record<string, unknown>) => Promise<unknown | null>;
  create: (args: Record<string, unknown>) => Promise<unknown>;
  update: (args: Record<string, unknown>) => Promise<unknown>;
  delete: (args: Record<string, unknown>) => Promise<unknown>;
};

export class PrismaRepository<T extends { id: string }, TCreate extends object, TUpdate extends object> {
  constructor(private readonly delegate: Delegate) {}

  async findAll() {
    const records = await this.delegate.findMany({ orderBy: { createdAt: "desc" } });
    return serializeRecord(records) as T[];
  }

  async findById(id: string) {
    const record = await this.delegate.findUnique({ where: { id } });
    return record ? (serializeRecord(record) as T) : null;
  }

  async create(payload: TCreate) {
    const record = await this.delegate.create({ data: payload });
    return serializeRecord(record) as T;
  }

  async update(id: string, payload: TUpdate) {
    try {
      const record = await this.delegate.update({ where: { id }, data: payload });
      return serializeRecord(record) as T;
    } catch {
      return null;
    }
  }

  async remove(id: string) {
    try {
      await this.delegate.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
