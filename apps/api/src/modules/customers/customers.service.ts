import { Customer } from '@rent-a-wheel/database';
import {
  PaginatedResult,
  PaginationDto,
} from '../../common/dto/pagination.dto';
import { ForbiddenException, NotFoundException } from '../../common/exceptions';
import {
  CustomerRepository,
  SubscriptionRepository,
} from '../../infrastructure/database/repositories';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

/**
 * Customers Service
 * Contains all business logic for customer operations
 */
export class CustomersService {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly subscriptionRepo: SubscriptionRepository
  ) {}

  /**
   * Get all customers with pagination
   */
  async findAll(
    pagination: PaginationDto,
    tenantId: string
  ): Promise<PaginatedResult<Customer>> {
    return this.customerRepo.findAll(pagination, {}, tenantId);
  }

  /**
   * Get a single customer by ID with bookings
   */
  async findById(id: string, tenantId: string): Promise<Customer> {
    const customer = await this.customerRepo.findByIdWithBookings(id, tenantId);

    if (!customer) {
      throw new NotFoundException('Customer');
    }

    return customer;
  }

  /**
   * Create a new customer
   * Checks subscription limits before creating
   */
  async create(dto: CreateCustomerDto, tenantId: string): Promise<Customer> {
    // Check subscription limits
    const subscription = await this.subscriptionRepo.findByTenantId(tenantId);

    if (!subscription) {
      throw new ForbiddenException('No active subscription');
    }

    const customerCount = await this.customerRepo.count({}, tenantId);

    if (
      subscription.customerLimit !== -1 &&
      customerCount >= subscription.customerLimit
    ) {
      throw new ForbiddenException(
        'Customer limit reached. Please upgrade your subscription plan.'
      );
    }

    return this.customerRepo.create(dto, tenantId);
  }

  /**
   * Update an existing customer
   */
  async update(
    id: string,
    dto: UpdateCustomerDto,
    tenantId: string
  ): Promise<Customer> {
    // Check if customer exists
    const exists = await this.customerRepo.exists(id, tenantId);

    if (!exists) {
      throw new NotFoundException('Customer');
    }

    return this.customerRepo.update(id, dto, tenantId);
  }

  /**
   * Soft delete a customer
   */
  async delete(id: string, tenantId: string): Promise<void> {
    // Check if customer exists
    const exists = await this.customerRepo.exists(id, tenantId);

    if (!exists) {
      throw new NotFoundException('Customer');
    }

    await this.customerRepo.softDelete(id, tenantId);
  }
}
