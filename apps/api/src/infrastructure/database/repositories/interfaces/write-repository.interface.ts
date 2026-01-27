/**
 * Write Repository Interface (CQRS Command Side)
 * Handles all write operations for an entity
 */
export interface IWriteRepository<T, CreateDto, UpdateDto> {
  /**
   * Create a new entity
   */
  create(data: CreateDto, tenantId?: string): Promise<T>;

  /**
   * Update an existing entity
   */
  update(id: string, data: UpdateDto, tenantId?: string): Promise<T>;

  /**
   * Hard delete an entity
   */
  delete(id: string, tenantId?: string): Promise<void>;

  /**
   * Soft delete an entity (sets deletedAt)
   */
  softDelete(id: string, tenantId?: string): Promise<void>;
}
