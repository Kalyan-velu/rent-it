import {
  PrismaClient,
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@rent-a-wheel/database';

export interface UpdateSubscriptionDto {
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  customerLimit?: number;
  formLimit?: number;
}

/**
 * Subscription Repository
 * Handles subscription CRUD operations
 */
export class SubscriptionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByTenantId(tenantId: string): Promise<Subscription | null> {
    return this.prisma.subscription.findUnique({
      where: { tenantId },
    });
  }

  async update(
    tenantId: string,
    data: UpdateSubscriptionDto
  ): Promise<Subscription> {
    // Get plan limits if plan is changing
    let limits = {};
    if (data.plan) {
      const planLimits = {
        BASIC: { customerLimit: 100, formLimit: 100 },
        PROFESSIONAL: { customerLimit: 1000, formLimit: 1000 },
        ENTERPRISE: { customerLimit: -1, formLimit: -1 },
      };
      limits = planLimits[data.plan];
    }

    return this.prisma.subscription.update({
      where: { tenantId },
      data: {
        ...data,
        ...limits,
      },
    });
  }

  async countByStatus(status: SubscriptionStatus): Promise<number> {
    return this.prisma.subscription.count({
      where: { status },
    });
  }

  async groupByPlan(): Promise<
    Array<{ plan: SubscriptionPlan; count: number }>
  > {
    const result = await this.prisma.subscription.groupBy({
      by: ['plan'],
      _count: { plan: true },
    });

    return result.map((item) => ({
      plan: item.plan,
      count: item._count.plan,
    }));
  }
}
