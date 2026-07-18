export interface CrudRepository<T extends { id: string }, TCreate extends object, TUpdate extends object> {
  findAll: () => Promise<T[]>;
  findById: (id: string) => Promise<T | null>;
  create: (payload: TCreate) => Promise<T>;
  update: (id: string, payload: TUpdate) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
}

export class EntityService<T extends { id: string }, TCreate extends object, TUpdate extends object> {
  constructor(private readonly repository: CrudRepository<T, TCreate, TUpdate>) {}

  list() {
    return this.repository.findAll();
  }

  get(id: string) {
    return this.repository.findById(id);
  }

  create(payload: TCreate) {
    return this.repository.create(payload);
  }

  update(id: string, payload: TUpdate) {
    return this.repository.update(id, payload);
  }

  remove(id: string) {
    return this.repository.remove(id);
  }
}
