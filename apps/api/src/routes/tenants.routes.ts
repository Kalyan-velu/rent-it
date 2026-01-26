import { prisma } from '@rent-a-wheel/database';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router: Router = Router();

// All routes require super admin
router.use(authenticateToken);
router.use(requireRole('SUPER_ADMIN'));

// Validation schemas
const tenantSchema = z.object({
  name: z.string().min(2),
  subdomain: z.string().regex(/^[a-z0-9-]+$/),
  logoUrl: z.string().url().optional(),
  customDomain: z.string().optional(),
});

const subscriptionSchema = z.object({
  plan: z.enum(['BASIC', 'PROFESSIONAL', 'ENTERPRISE']),
  status: z.enum(['ACTIVE', 'TRIALING', 'CANCELED', 'PAST_DUE']).optional(),
});

/**
 * GET /tenants
 * List all tenants
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          {
            name: { contains: search as string, mode: 'insensitive' as const },
          },
          {
            subdomain: {
              contains: search as string,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        skip,
        take: Number(limit),
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
      prisma.tenant.count({ where }),
    ]);

    res.json({
      tenants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('List tenants error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /tenants/:id
 * Get a single tenant by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: req.params.id,
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

    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    res.json(tenant);
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /tenants
 * Create a new tenant with subscription
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const tenantData = tenantSchema.parse(req.body);
    const { plan = 'BASIC' } = req.body as { plan?: string };

    // Check subdomain uniqueness
    const existing = await prisma.tenant.findUnique({
      where: { subdomain: tenantData.subdomain },
    });

    if (existing) {
      res.status(409).json({ error: 'Subdomain already taken' });
      return;
    }

    // Determine limits based on plan
    const planLimits = {
      BASIC: { customerLimit: 100, formLimit: 100 },
      PROFESSIONAL: { customerLimit: 1000, formLimit: 1000 },
      ENTERPRISE: { customerLimit: -1, formLimit: -1 },
    };

    const limits =
      planLimits[plan as keyof typeof planLimits] || planLimits.BASIC;

    // Create tenant with subscription
    const tenant = await prisma.tenant.create({
      data: {
        ...tenantData,
        subscription: {
          create: {
            plan: plan as any,
            status: 'TRIALING',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 day trial
            ...limits,
          },
        },
      },
      include: {
        subscription: true,
      },
    });

    res.status(201).json(tenant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Create tenant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /tenants/:id
 * Update a tenant
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = tenantSchema.partial().parse(req.body);

    const tenant = await prisma.tenant.updateMany({
      where: {
        id: req.params.id,
        deletedAt: null,
      },
      data,
    });

    if (tenant.count === 0) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    const updated = await prisma.tenant.findUnique({
      where: { id: req.params.id },
      include: { subscription: true },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Update tenant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /tenants/:id/subscription
 * Update tenant subscription
 */
router.patch('/:id/subscription', async (req: Request, res: Response) => {
  try {
    const data = subscriptionSchema.parse(req.body);

    const tenant = await prisma.tenant.findFirst({
      where: { id: req.params.id, deletedAt: null },
      include: { subscription: true },
    });

    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    // Determine new limits
    const planLimits = {
      BASIC: { customerLimit: 100, formLimit: 100 },
      PROFESSIONAL: { customerLimit: 1000, formLimit: 1000 },
      ENTERPRISE: { customerLimit: -1, formLimit: -1 },
    };

    const limits = planLimits[data.plan];

    const subscription = await prisma.subscription.update({
      where: { tenantId: req.params.id },
      data: {
        plan: data.plan,
        status: data.status || tenant.subscription?.status,
        ...limits,
      },
    });

    res.json(subscription);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /tenants/:id
 * Soft delete a tenant
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const tenant = await prisma.tenant.updateMany({
      where: {
        id: req.params.id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    if (tenant.count === 0) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete tenant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /tenants/stats
 * Get platform-wide statistics
 */
router.get('/stats/overview', async (_req: Request, res: Response) => {
  try {
    const [
      totalTenants,
      activeTenants,
      totalUsers,
      totalCustomers,
      totalVehicles,
      totalBookings,
      subscriptionCounts,
    ] = await Promise.all([
      prisma.tenant.count({ where: { deletedAt: null } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.customer.count({ where: { deletedAt: null } }),
      prisma.vehicle.count({ where: { deletedAt: null } }),
      prisma.booking.count(),
      prisma.subscription.groupBy({
        by: ['plan'],
        _count: { plan: true },
      }),
    ]);

    res.json({
      tenants: {
        total: totalTenants,
        active: activeTenants,
      },
      users: totalUsers,
      customers: totalCustomers,
      vehicles: totalVehicles,
      bookings: totalBookings,
      subscriptions: subscriptionCounts.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.plan.toLowerCase()] = item._count.plan;
          return acc;
        },
        {} as Record<string, number>
      ),
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
