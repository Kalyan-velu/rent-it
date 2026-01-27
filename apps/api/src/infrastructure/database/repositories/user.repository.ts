import { Prisma, PrismaClient, User, UserRole } from '@rent-a-wheel/database';
import {
  PaginatedResult,
  PaginationDto,
} from '../../../common/dto/pagination.dto';
import { IReadRepository } from './interfaces/read-repository.interface';
import { IWriteRepository } from './interfaces/write-repository.interface';

export interface CreateUserDto {
  email: string;
  passwordHash?: string;
  name: string;
  role?: UserRole;
  tenantId?: string;
  googleId?: string;
  githubId?: string;
}

export interface UpdateUserDto {
  name?: string;
  role?: UserRole;
  passwordHash?: string;
  lastLoginAt?: Date;
  loginCount?: number;
}

export interface UserFindOptions {
  search?: string;
  role?: UserRole;
}

/**
 * User Repository
 * Implements CQRS pattern with separate read/write interfaces
 */
export class UserRepository
  implements
    IReadRepository<User, UserFindOptions, Prisma.UserWhereInput>,
    IWriteRepository<User, CreateUserDto, UpdateUserDto>
{
  constructor(private readonly prisma: PrismaClient) {}

  // =====================
  // READ OPERATIONS (Query)
  // =====================

  async findById(id: string, tenantId?: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
  }

  async findAll(
    pagination: PaginationDto,
    options?: UserFindOptions,
    tenantId?: string
  ): Promise<PaginatedResult<User>> {
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      ...(tenantId && { tenantId }),
      deletedAt: null,
      ...(options?.role && { role: options.role }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(
    where: Prisma.UserWhereInput,
    tenantId?: string
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        ...where,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async count(
    where?: Prisma.UserWhereInput,
    tenantId?: string
  ): Promise<number> {
    return this.prisma.user.count({
      where: {
        ...where,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
  }

  async exists(id: string, tenantId?: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        id,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
    return count > 0;
  }

  // =====================
  // WRITE OPERATIONS (Command)
  // =====================

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        role: data.role || 'TENANT_USER',
      },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
