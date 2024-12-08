export interface IRepository<T, K = string> {
  findById(id: K): Promise<T | null>;
  create(data: T): Promise<T>;
  update(id: K, data: Partial<T>): Promise<T>;
  delete(id: K): Promise<void>;
}
