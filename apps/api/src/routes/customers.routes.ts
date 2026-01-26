import { prisma } from '@rent-a-wheel/database';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import {
  authenticateToken,
  requireTenant,
} from '../middleware/auth.middleware';

const router: Router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(requireTenant);

// Validation schema
const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  leadSource: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

/**
 * GET /customers
 * List all customers for the tenant
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      tenantId: req.tenantId!,
      deletedAt: null,
      ...(search && {
        OR: [
          {
            name: { contains: search as string, mode: 'insensitive' as const },
          },
          {
            email: { contains: search as string, mode: 'insensitive' as const },
          },
          { phone: { contains: search as string } },
        ],
      }),
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({
      customers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('List customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /customers/:id
 * Get a single customer by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
        deletedAt: null,
      },
      include: {
        bookings: {
          include: {
            vehicle: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /customers
 * Create a new customer
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = customerSchema.parse(req.body);

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({
      where: { tenantId: req.tenantId! },
    });

    if (!subscription) {
      res.status(403).json({ error: 'No active subscription' });
      return;
    }

    const customerCount = await prisma.customer.count({
      where: { tenantId: req.tenantId!, deletedAt: null },
    });

    if (
      subscription.customerLimit !== -1 &&
      customerCount >= subscription.customerLimit
    ) {
      res.status(403).json({
        error: 'Customer limit reached',
        message: 'Please upgrade your subscription plan',
      });
      return;
    }

    const customer = await prisma.customer.create({
      data: {
        ...data,
        tenantId: req.tenantId!,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /customers/:id
 * Update a customer
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = customerSchema.partial().parse(req.body);

    const customer = await prisma.customer.updateMany({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
        deletedAt: null,
      },
      data,
    });

    if (customer.count === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const updated = await prisma.customer.findUnique({
      where: { id: req.params.id },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /customers/:id
 * Soft delete a customer
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.updateMany({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    if (customer.count === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
