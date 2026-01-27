import {
  Prisma,
  PrismaClient,
  Vehicle,
  VehicleStatus,
} from '@rent-a-wheel/database';
import {
  PaginatedResult,
  PaginationDto,
} from '../../../common/dto/pagination.dto';
import { IReadRepository } from './interfaces/read-repository.interface';
import { IWriteRepository } from './interfaces/write-repository.interface';

export interface CreateVehicleDto {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  category: string;
  seats: number;
  transmission: string;
  fuelType: string;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  status?: VehicleStatus;
  images?: string[];
  features?: string[];
  mileage?: number;
}

export type UpdateVehicleDto = Partial<CreateVehicleDto>;

export interface VehicleFindOptions {
  search?: string;
  status?: VehicleStatus;
  category?: string;
}

/**
 * Vehicle Repository
 * Implements CQRS pattern with separate read/write interfaces
 */
export class VehicleRepository
  implements
    IReadRepository<Vehicle, VehicleFindOptions, Prisma.VehicleWhereInput>,
    IWriteRepository<Vehicle, CreateVehicleDto, UpdateVehicleDto>
{
  constructor(private readonly prisma: PrismaClient) {}

  // =====================
  // READ OPERATIONS (Query)
  // =====================

  async findById(id: string, tenantId?: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findFirst({
      where: {
        id,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
  }

  async findAll(
    pagination: PaginationDto,
    options?: VehicleFindOptions,
    tenantId?: string
  ): Promise<PaginatedResult<Vehicle>> {
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      ...(tenantId && { tenantId }),
      deletedAt: null,
      ...(options?.status && { status: options.status }),
      ...(options?.category && { category: options.category }),
      ...(search && {
        OR: [
          { make: { contains: search, mode: 'insensitive' as const } },
          { model: { contains: search, mode: 'insensitive' as const } },
          { licensePlate: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vehicle.count({ where }),
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
    where: Prisma.VehicleWhereInput,
    tenantId?: string
  ): Promise<Vehicle | null> {
    return this.prisma.vehicle.findFirst({
      where: {
        ...where,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
  }

  async count(
    where?: Prisma.VehicleWhereInput,
    tenantId?: string
  ): Promise<number> {
    return this.prisma.vehicle.count({
      where: {
        ...where,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
  }

  async exists(id: string, tenantId?: string): Promise<boolean> {
    const count = await this.prisma.vehicle.count({
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
  ): Promise<Vehicle | null> {
    return this.prisma.vehicle.findFirst({
      where: {
        id,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
      include: {
        bookings: {
          where: { status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] } },
          include: { customer: true },
          orderBy: { startDate: 'asc' },
        },
      },
    });
  }

  // =====================
  // WRITE OPERATIONS (Command)
  // =====================

  async create(data: CreateVehicleDto, tenantId?: string): Promise<Vehicle> {
    return this.prisma.vehicle.create({
      data: {
        ...data,
        tenantId: tenantId!,
      },
    });
  }

  async update(
    id: string,
    data: UpdateVehicleDto,
    tenantId?: string
  ): Promise<Vehicle> {
    await this.prisma.vehicle.updateMany({
      where: {
        id,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
      data,
    });

    return this.prisma.vehicle.findUniqueOrThrow({ where: { id } });
  }

  async updateStatus(
    id: string,
    status: VehicleStatus,
    tenantId?: string
  ): Promise<void> {
    await this.prisma.vehicle.updateMany({
      where: {
        id,
        ...(tenantId && { tenantId }),
      },
      data: { status },
    });
  }

  async delete(id: string, tenantId?: string): Promise<void> {
    await this.prisma.vehicle.deleteMany({
      where: {
        id,
        ...(tenantId && { tenantId }),
      },
    });
  }

  async softDelete(id: string, tenantId?: string): Promise<void> {
    await this.prisma.vehicle.updateMany({
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
