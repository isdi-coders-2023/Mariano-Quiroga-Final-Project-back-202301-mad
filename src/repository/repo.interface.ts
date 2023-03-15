export interface Repo<T> {
  query(): Promise<T[]>;
  queryId(id: string): Promise<T>;
  search(query: { key: string; value: unknown }): Promise<T[]>;
  create(newItem: Partial<T>): Promise<T>;
  update(item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
