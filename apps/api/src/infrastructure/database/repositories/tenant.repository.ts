import { PrismaClient, SubscriptionPlan, Tenant } from '@rent-a-wheel/database';
import {
  PaginatedResult,
  PaginationDto,
} from '../../../common/dto/pagination.dto';
import { IReadRepository } from './interfaces/read-repository.interface';
import { IWriteRepository } from './interfaces/write-repository.interface';

export interface CreateTenantDto {
  name: string;
  subdomain: string;
  logoUrl?: string;
  customDomain?: string;
}

export type UpdateTenantDto = Partial<CreateTenantDto>;

export interface TenantFindOptions {
  search?: string;
}

export interface CreateTenantWithSubscriptionDto extends CreateTenantDto {
  plan?: SubscriptionPlan;
}

/**
 * Tenant Repository
 * Implements CQRS pattern with separate read/write interfaces
 */
export class TenantRepository
  implements
    IReadRepository<Tenant, TenantFindOptions>,
    IWriteRepository<Tenant, CreateTenantDto, UpdateTenantDto>
{
  constructor(private readonly prisma: PrismaClient) {}

  // =====================
  // READ OPERATIONS (Query)
  // =====================

  async findById(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        subscription: true,
      },
    });
  }

  async findAll(
    pagination: PaginationDto,
    options?: TenantFindOptions
  ): Promise<PaginatedResult<Tenant>> {
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { subdomain: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        include: {
          subscription: true,
          _count: {
            select: {
              users: true,
              customers: true,
              vehicles: true,
              bookings: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count({ where }),
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

  async findOne(where: Partial<Tenant>): Promise<Tenant | null> {
    return this.prisma.tenant.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        subscription: true,
      },
    });
  }

  async count(where?: Partial<Tenant>): Promise<number> {
    return this.prisma.tenant.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.tenant.count({
      where: {
        id,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { subdomain },
      include: { subscription: true },
    });
  }

  async findByIdWithDetails(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        subscription: {
          include: {
            invoices: {
              take: 10,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            lastLoginAt: true,
          },
        },
        _count: {
          select: {
            customers: true,
            vehicles: true,
            bookings: true,
            forms: true,
          },
        },
      },
    });
  }

  // =====================
  // WRITE OPERATIONS (Command)
  // =====================

  async create(data: CreateTenantDto): Promise<Tenant> {
    return this.prisma.tenant.create({
      data,
      include: { subscription: true },
    });
  }

  async createWithSubscription(
    data: CreateTenantWithSubscriptionDto
  ): Promise<Tenant> {
    const { plan = 'BASIC', ...tenantData } = data;

    const planLimits = {
      BASIC: { customerLimit: 100, formLimit: 100 },
      PROFESSIONAL: { customerLimit: 1000, formLimit: 1000 },
      ENTERPRISE: { customerLimit: -1, formLimit: -1 },
    };

    const limits = planLimits[plan];

    return this.prisma.tenant.create({
      data: {
        ...tenantData,
        subscription: {
          create: {
            plan,
            status: 'TRIALING',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            ...limits,
          },
        },
      },
      include: { subscription: true },
    });
  }

  async update(id: string, data: UpdateTenantDto): Promise<Tenant> {
    await this.prisma.tenant.updateMany({
      where: {
        id,
        deletedAt: null,
      },
      data,
    });

    return this.prisma.tenant.findUniqueOrThrow({
      where: { id },
      include: { subscription: true },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tenant.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.tenant.updateMany({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
