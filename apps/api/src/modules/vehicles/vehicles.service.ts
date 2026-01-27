import { Vehicle, VehicleStatus } from '@rent-a-wheel/database';
import {
  PaginatedResult,
  PaginationDto,
} from '../../common/dto/pagination.dto';
import { NotFoundException } from '../../common/exceptions';
import { VehicleRepository } from '../../infrastructure/database/repositories';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';

export interface VehicleQueryOptions {
  status?: VehicleStatus;
  category?: string;
}

/**
 * Vehicles Service
 * Contains all business logic for vehicle operations
 */
export class VehiclesService {
  constructor(private readonly vehicleRepo: VehicleRepository) {}

  /**
   * Get all vehicles with pagination and filters
   */
  async findAll(
    pagination: PaginationDto,
    options: VehicleQueryOptions,
    tenantId: string
  ): Promise<PaginatedResult<Vehicle>> {
    return this.vehicleRepo.findAll(pagination, options, tenantId);
  }

  /**
   * Get a single vehicle by ID with bookings
   */
  async findById(id: string, tenantId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findByIdWithBookings(id, tenantId);

    if (!vehicle) {
      throw new NotFoundException('Vehicle');
    }

    return vehicle;
  }

  /**
   * Create a new vehicle
   */
  async create(dto: CreateVehicleDto, tenantId: string): Promise<Vehicle> {
    return this.vehicleRepo.create(dto, tenantId);
  }

  /**
   * Update an existing vehicle
   */
  async update(
    id: string,
    dto: UpdateVehicleDto,
    tenantId: string
  ): Promise<Vehicle> {
    const exists = await this.vehicleRepo.exists(id, tenantId);

    if (!exists) {
      throw new NotFoundException('Vehicle');
    }

    return this.vehicleRepo.update(id, dto, tenantId);
  }

  /**
   * Soft delete a vehicle
   */
  async delete(id: string, tenantId: string): Promise<void> {
    const exists = await this.vehicleRepo.exists(id, tenantId);

    if (!exists) {
      throw new NotFoundException('Vehicle');
    }

    await this.vehicleRepo.softDelete(id, tenantId);
  }

  /**
   * Update vehicle status
   */
  async updateStatus(
    id: string,
    status: VehicleStatus,
    tenantId: string
  ): Promise<void> {
    const exists = await this.vehicleRepo.exists(id, tenantId);

    if (!exists) {
      throw new NotFoundException('Vehicle');
    }

    await this.vehicleRepo.updateStatus(id, status, tenantId);
  }
}
