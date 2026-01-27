import { Booking, BookingStatus } from '@rent-a-wheel/database';
import {
  PaginatedResult,
  PaginationDto,
} from '../../common/dto/pagination.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '../../common/exceptions';
import {
  BookingRepository,
  CustomerRepository,
  VehicleRepository,
} from '../../infrastructure/database/repositories';
import { CreateBookingDto } from './dto/booking.dto';

export interface BookingQueryOptions {
  status?: BookingStatus;
  customerId?: string;
  vehicleId?: string;
}

/**
 * Bookings Service
 * Contains all business logic for booking operations
 */
export class BookingsService {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly vehicleRepo: VehicleRepository
  ) {}

  /**
   * Get all bookings with pagination and filters
   */
  async findAll(
    pagination: PaginationDto,
    options: BookingQueryOptions,
    tenantId: string
  ): Promise<PaginatedResult<Booking>> {
    return this.bookingRepo.findAll(pagination, options, tenantId);
  }

  /**
   * Get a single booking by ID
   */
  async findById(id: string, tenantId: string): Promise<Booking> {
    const booking = await this.bookingRepo.findById(id, tenantId);

    if (!booking) {
      throw new NotFoundException('Booking');
    }

    return booking;
  }

  /**
   * Create a new booking
   * - Validates customer and vehicle exist
   * - Checks vehicle availability
   * - Checks for overlapping bookings
   * - Calculates pricing
   * - Generates booking number
   */
  async create(dto: CreateBookingDto, tenantId: string): Promise<Booking> {
    // Verify customer and vehicle belong to tenant
    const [customer, vehicle] = await Promise.all([
      this.customerRepo.findById(dto.customerId, tenantId),
      this.vehicleRepo.findById(dto.vehicleId, tenantId),
    ]);

    if (!customer) {
      throw new NotFoundException('Customer');
    }

    if (!vehicle) {
      throw new NotFoundException('Vehicle');
    }

    // Check vehicle availability
    if (vehicle.status !== 'AVAILABLE') {
      throw new BadRequestException('Vehicle not available', {
        status: vehicle.status,
      });
    }

    // Check for overlapping bookings
    const overlapping = await this.bookingRepo.findOverlapping(
      dto.vehicleId,
      dto.startDate,
      dto.endDate,
      tenantId
    );

    if (overlapping) {
      throw new ConflictException('Vehicle already booked for these dates', {
        conflictingBooking: overlapping.id,
      });
    }

    // Calculate pricing
    const totalDays = Math.ceil(
      (dto.endDate.getTime() - dto.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const subtotal = vehicle.dailyRate * totalDays;
    const tax = subtotal * 0.18; // 18% GST
    const addOnsTotal = (dto.addOns || []).reduce(
      (sum, addon) => sum + addon.price,
      0
    );
    const total = subtotal + tax + addOnsTotal;

    // Generate booking number
    const bookingCount = await this.bookingRepo.countByTenant(tenantId);
    const bookingNumber = `BK-${new Date().getFullYear()}-${String(bookingCount + 1).padStart(4, '0')}`;

    // Create booking
    const booking = await this.bookingRepo.create(
      {
        bookingNumber,
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        startDate: dto.startDate,
        endDate: dto.endDate,
        dailyRate: vehicle.dailyRate,
        totalDays,
        subtotal,
        tax,
        total,
        addOns: dto.addOns,
        notes: dto.notes,
      },
      tenantId
    );

    // Update vehicle status
    await this.vehicleRepo.updateStatus(dto.vehicleId, 'RENTED', tenantId);

    return booking;
  }

  /**
   * Update booking status
   */
  async updateStatus(
    id: string,
    status: BookingStatus,
    tenantId: string
  ): Promise<Booking> {
    const booking = await this.bookingRepo.findById(id, tenantId);

    if (!booking) {
      throw new NotFoundException('Booking');
    }

    const validStatuses = ['CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const updated = await this.bookingRepo.updateStatus(id, status, tenantId);

    // Update vehicle status when booking completes or is cancelled
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      await this.vehicleRepo.updateStatus(
        booking.vehicleId,
        'AVAILABLE',
        tenantId
      );
    }

    return updated;
  }
}
