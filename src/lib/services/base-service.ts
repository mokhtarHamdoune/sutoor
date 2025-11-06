interface BaseService<T> {
  save(item: T): Promise<T>;
  getById(id: string): Promise<T | null>;
  getBy(filer: Partial<T>): Promise<T[]>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export default BaseService;
