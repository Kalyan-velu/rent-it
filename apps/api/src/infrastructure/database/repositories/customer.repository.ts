import { Customer, Prisma, PrismaClient } from '@rent-a-wheel/database';
import {
  PaginatedResult,
  PaginationDto,
} from '../../../common/dto/pagination.dto';
import { IReadRepository } from './interfaces/read-repository.interface';
import { IWriteRepository } from './interfaces/write-repository.interface';

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  leadSource?: string;
  tags?: string[];
  notes?: string;
}

export type UpdateCustomerDto = Partial<CreateCustomerDto>;

export interface CustomerFindOptions {
  search?: string;
}

/**
 * Customer Repository
 * Implements CQRS pattern with separate read/write interfaces
 */
export class CustomerRepository
  implements
    IReadRepository<Customer, CustomerFindOptions, Prisma.CustomerWhereInput>,
    IWriteRepository<Customer, CreateCustomerDto, UpdateCustomerDto>
{
  constructor(private readonly prisma: PrismaClient) {}

  // =====================
  // READ OPERATIONS (Query)
  // =====================

  async findById(id: string, tenantId?: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: {
        id,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
  }

  async findAll(
    pagination: PaginationDto,
    options?: CustomerFindOptions,
    tenantId?: string
  ): Promise<PaginatedResult<Customer>> {
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      ...(tenantId && { tenantId }),
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
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
    where: Prisma.CustomerWhereInput,
    tenantId?: string
  ): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: {
        ...where,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
  }

  async count(
    where?: Prisma.CustomerWhereInput,
    tenantId?: string
  ): Promise<number> {
    return this.prisma.customer.count({
      where: {
        ...where,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
  }

  async exists(id: string, tenantId?: string): Promise<boolean> {
    const count = await this.prisma.customer.count({
      where: {
        id,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async findByIdWithBookings(
    id: string,
    tenantId?: string
  ): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: {
        id,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
      include: {
        bookings: {
          include: { vehicle: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // =====================
  // WRITE OPERATIONS (Command)
  // =====================

  async create(data: CreateCustomerDto, tenantId?: string): Promise<Customer> {
    return this.prisma.customer.create({
      data: {
        ...data,
        tenantId: tenantId!,
      },
    });
  }

  async update(
    id: string,
    data: UpdateCustomerDto,
    tenantId?: string
  ): Promise<Customer> {
    await this.prisma.customer.updateMany({
      where: {
        id,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
      data,
    });

    return this.prisma.customer.findUniqueOrThrow({ where: { id } });
  }

  async delete(id: string, tenantId?: string): Promise<void> {
    await this.prisma.customer.deleteMany({
      where: {
        id,
        ...(tenantId && { tenantId }),
      },
    });
  }

  async softDelete(id: string, tenantId?: string): Promise<void> {
    await this.prisma.customer.updateMany({
      where: {
        id,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
