import { readCollection, writeCollection } from "../utils/file-db.js";

export class JsonRepository<T extends { id: string }> {
  constructor(private readonly collection: string) {}

  findAll() {
    return readCollection<T>(this.collection);
  }

  async findById(id: string) {
    const records = await this.findAll();
    return records.find((record) => record.id === id) ?? null;
  }

  async create(payload: T) {
    const records = await this.findAll();
    records.push(payload);
    await writeCollection(this.collection, records);
    return payload;
  }

  async update(id: string, payload: Partial<T>) {
    const records = await this.findAll();
    const index = records.findIndex((record) => record.id === id);
    if (index === -1) {
      return null;
    }

    const updated = { ...records[index], ...payload };
    records[index] = updated;
    await writeCollection(this.collection, records);
    return updated;
  }

  async remove(id: string) {
    const records = await this.findAll();
    const filtered = records.filter((record) => record.id !== id);
    if (filtered.length === records.length) {
      return false;
    }

    await writeCollection(this.collection, filtered);
    return true;
  }
}
