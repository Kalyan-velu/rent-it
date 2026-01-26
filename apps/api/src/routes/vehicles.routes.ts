import { prisma } from '@rent-a-wheel/database';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import {
  authenticateToken,
  requireTenant,
} from '../middleware/auth.middleware';

const router: Router = Router();

// Apply authentication middleware
router.use(authenticateToken);
router.use(requireTenant);

// Validation schema
const vehicleSchema = z.object({
  make: z.string().min(2),
  model: z.string().min(1),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  licensePlate: z.string(),
  vin: z.string().optional(),
  category: z.string(),
  seats: z.number().int().min(1),
  transmission: z.string(),
  fuelType: z.string(),
  dailyRate: z.number().positive(),
  weeklyRate: z.number().positive().optional(),
  monthlyRate: z.number().positive().optional(),
  status: z
    .enum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'UNAVAILABLE'])
    .optional(),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  mileage: z.number().int().min(0).optional(),
});

/**
 * GET /vehicles
 * List all vehicles for the tenant
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      category,
      search = '',
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      tenantId: req.tenantId!,
      deletedAt: null,
      ...(status && { status: status as string }),
      ...(category && { category: category as string }),
      ...(search && {
        OR: [
          {
            make: { contains: search as string, mode: 'insensitive' as const },
          },
          {
            model: { contains: search as string, mode: 'insensitive' as const },
          },
          {
            licensePlate: {
              contains: search as string,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vehicle.count({ where }),
    ]);

    res.json({
      vehicles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('List vehicles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /vehicles/:id
 * Get a single vehicle by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
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

    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /vehicles
 * Create a new vehicle
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = vehicleSchema.parse(req.body);

    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        tenantId: req.tenantId!,
      },
    });

    res.status(201).json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Create vehicle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /vehicles/:id
 * Update a vehicle
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = vehicleSchema.partial().parse(req.body);

    const vehicle = await prisma.vehicle.updateMany({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
        deletedAt: null,
      },
      data,
    });

    if (vehicle.count === 0) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    const updated = await prisma.vehicle.findUnique({
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
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /vehicles/:id
 * Soft delete a vehicle
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const vehicle = await prisma.vehicle.updateMany({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    if (vehicle.count === 0) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
