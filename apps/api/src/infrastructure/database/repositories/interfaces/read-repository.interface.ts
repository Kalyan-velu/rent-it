import {
  PaginatedResult,
  PaginationDto,
} from '../../../../common/dto/pagination.dto';

/**
 * Read Repository Interface (CQRS Query Side)
 * Handles all read operations for an entity
 *
 * @template T - The entity type
 * @template FindOptions - Additional options for findAll queries
 * @template WhereInput - Prisma-compatible where input type (defaults to Record<string, unknown>)
 */
export interface IReadRepository<
  T,
  FindOptions = Record<string, unknown>,
  WhereInput = Record<string, unknown>,
> {
  /**
   * Find a single entity by ID
   */
  findById(id: string, tenantId?: string): Promise<T | null>;

  /**
   * Find all entities with pagination
   */
  findAll(
    pagination: PaginationDto,
    options?: FindOptions,
    tenantId?: string
  ): Promise<PaginatedResult<T>>;

  /**
   * Find a single entity by criteria
   */
  findOne(where: WhereInput, tenantId?: string): Promise<T | null>;

  /**
   * Count entities matching criteria
   */
  count(where?: WhereInput, tenantId?: string): Promise<number>;

  /**
   * Check if entity exists
   */
  exists(id: string, tenantId?: string): Promise<boolean>;
}
