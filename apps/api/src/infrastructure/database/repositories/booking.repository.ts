import {
  Booking,
  BookingStatus,
  Prisma,
  PrismaClient,
} from '@rent-a-wheel/database';
import {
  PaginatedResult,
  PaginationDto,
} from '../../../common/dto/pagination.dto';
import { IReadRepository } from './interfaces/read-repository.interface';
import { IWriteRepository } from './interfaces/write-repository.interface';

export interface CreateBookingDto {
  bookingNumber: string;
  customerId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  dailyRate: number;
  totalDays: number;
  subtotal: number;
  tax: number;
  total: number;
  addOns?: Array<{ name: string; price: number }>;
  notes?: string;
}

export interface UpdateBookingDto {
  status?: BookingStatus;
  notes?: string;
}

export interface BookingFindOptions {
  status?: BookingStatus;
  customerId?: string;
  vehicleId?: string;
}

/**
 * Booking Repository
 * Implements CQRS pattern with separate read/write interfaces
 */
export class BookingRepository
  implements
    IReadRepository<Booking, BookingFindOptions, Prisma.BookingWhereInput>,
    IWriteRepository<Booking, CreateBookingDto, UpdateBookingDto>
{
  constructor(private readonly prisma: PrismaClient) {}

  // =====================
  // READ OPERATIONS (Query)
  // =====================

  async findById(id: string, tenantId?: string): Promise<Booking | null> {
    return this.prisma.booking.findFirst({
      where: {
        id,
        ...(tenantId && { tenantId }),
      },
      include: {
        customer: true,
        vehicle: true,
      },
    });
  }

  async findAll(
    pagination: PaginationDto,
    options?: BookingFindOptions,
    tenantId?: string
  ): Promise<PaginatedResult<Booking>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      ...(tenantId && { tenantId }),
      ...(options?.status && { status: options.status }),
      ...(options?.customerId && { customerId: options.customerId }),
      ...(options?.vehicleId && { vehicleId: options.vehicleId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          vehicle: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
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
    where: Prisma.BookingWhereInput,
    tenantId?: string
  ): Promise<Booking | null> {
    return this.prisma.booking.findFirst({
      where: {
        ...where,
        ...(tenantId && { tenantId }),
      },
      include: {
        customer: true,
        vehicle: true,
      },
    });
  }

  async count(
    where?: Prisma.BookingWhereInput,
    tenantId?: string
  ): Promise<number> {
    return this.prisma.booking.count({
      where: {
        ...where,
        ...(tenantId && { tenantId }),
      },
    });
  }

  async exists(id: string, tenantId?: string): Promise<boolean> {
    const count = await this.prisma.booking.count({
      where: {
        id,
        ...(tenantId && { tenantId }),
      },
    });
    return count > 0;
  }

  async findOverlapping(
    vehicleId: string,
    startDate: Date,
    endDate: Date,
    tenantId?: string
  ): Promise<Booking | null> {
    return this.prisma.booking.findFirst({
      where: {
        vehicleId,
        ...(tenantId && { tenantId }),
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });
  }

  async countByTenant(tenantId: string): Promise<number> {
    return this.prisma.booking.count({
      where: { tenantId },
    });
  }

  // =====================
  // WRITE OPERATIONS (Command)
  // =====================

  async create(data: CreateBookingDto, tenantId?: string): Promise<Booking> {
    return this.prisma.booking.create({
      data: {
        ...data,
        tenantId: tenantId!,
      },
      include: {
        customer: true,
        vehicle: true,
      },
    });
  }

  async update(
    id: string,
    data: UpdateBookingDto,
    tenantId?: string
  ): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data,
      include: {
        customer: true,
        vehicle: true,
      },
    });
  }

  async updateStatus(
    id: string,
    status: BookingStatus,
    tenantId?: string
  ): Promise<Booking> {
    // Verify booking belongs to tenant
    const booking = await this.prisma.booking.findFirst({
      where: {
        id,
        ...(tenantId && { tenantId }),
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        vehicle: true,
      },
    });
  }

  async delete(id: string, tenantId?: string): Promise<void> {
    await this.prisma.booking.deleteMany({
      where: {
        id,
        ...(tenantId && { tenantId }),
      },
    });
  }

  async softDelete(_id: string, _tenantId?: string): Promise<void> {
    // Bookings don't have soft delete, throw error
    throw new Error('Bookings cannot be soft deleted');
  }
}
