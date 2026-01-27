import {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  Tenant,
  prisma,
} from '@rent-a-wheel/database';
import {
  PaginatedResult,
  PaginationDto,
} from '../../common/dto/pagination.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions';
import {
  SubscriptionRepository,
  TenantRepository,
} from '../../infrastructure/database/repositories';
import {
  CreateTenantDto,
  UpdateSubscriptionDto,
  UpdateTenantDto,
} from './dto/tenant.dto';

/**
 * Tenants Service
 * Contains all business logic for tenant management (super admin only)
 */
export class TenantsService {
  constructor(
    private readonly tenantRepo: TenantRepository,
    private readonly subscriptionRepo: SubscriptionRepository
  ) {}

  /**
   * Get all tenants with pagination
   */
  async findAll(pagination: PaginationDto): Promise<PaginatedResult<Tenant>> {
    return this.tenantRepo.findAll(pagination);
  }

  /**
   * Get a single tenant by ID with full details
   */
  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepo.findByIdWithDetails(id);

    if (!tenant) {
      throw new NotFoundException('Tenant');
    }

    return tenant;
  }

  /**
   * Create a new tenant with subscription
   */
  async create(dto: CreateTenantDto): Promise<Tenant> {
    // Check subdomain uniqueness
    const existing = await this.tenantRepo.findBySubdomain(dto.subdomain);
    if (existing) {
      throw new ConflictException('Subdomain already taken');
    }

    return this.tenantRepo.createWithSubscription({
      name: dto.name,
      subdomain: dto.subdomain,
      logoUrl: dto.logoUrl,
      customDomain: dto.customDomain,
      plan: dto.plan as SubscriptionPlan,
    });
  }

  /**
   * Update a tenant
   */
  async update(id: string, dto: UpdateTenantDto): Promise<Tenant> {
    const exists = await this.tenantRepo.exists(id);

    if (!exists) {
      throw new NotFoundException('Tenant');
    }

    return this.tenantRepo.update(id, dto);
  }

  /**
   * Update tenant subscription
   */
  async updateSubscription(
    id: string,
    dto: UpdateSubscriptionDto
  ): Promise<Subscription> {
    const tenant = await this.tenantRepo.findById(id);

    if (!tenant) {
      throw new NotFoundException('Tenant');
    }

    return this.subscriptionRepo.update(id, {
      plan: dto.plan as SubscriptionPlan,
      status: dto.status as SubscriptionStatus | undefined,
    });
  }

  /**
   * Soft delete a tenant
   */
  async delete(id: string): Promise<void> {
    const exists = await this.tenantRepo.exists(id);

    if (!exists) {
      throw new NotFoundException('Tenant');
    }

    await this.tenantRepo.softDelete(id);
  }

  /**
   * Get platform-wide statistics
   */
  async getStats(): Promise<{
    tenants: { total: number; active: number };
    users: number;
    customers: number;
    vehicles: number;
    bookings: number;
    subscriptions: Record<string, number>;
  }> {
    const [
      totalTenants,
      activeTenants,
      totalUsers,
      totalCustomers,
      totalVehicles,
      totalBookings,
      subscriptionCounts,
    ] = await Promise.all([
      this.tenantRepo.count(),
      this.subscriptionRepo.countByStatus('ACTIVE'),
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.customer.count({ where: { deletedAt: null } }),
      prisma.vehicle.count({ where: { deletedAt: null } }),
      prisma.booking.count(),
      this.subscriptionRepo.groupByPlan(),
    ]);

    return {
      tenants: {
        total: totalTenants,
        active: activeTenants,
      },
      users: totalUsers,
      customers: totalCustomers,
      vehicles: totalVehicles,
      bookings: totalBookings,
      subscriptions: subscriptionCounts.reduce(
        (acc, item) => {
          acc[item.plan.toLowerCase()] = item.count;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  }
}
