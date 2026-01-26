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
const bookingSchema = z.object({
  customerId: z.string(),
  vehicleId: z.string(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  addOns: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
      })
    )
    .optional(),
  notes: z.string().optional(),
});

/**
 * GET /bookings
 * List all bookings for the tenant
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      customerId,
      vehicleId,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      tenantId: req.tenantId!,
      ...(status && { status: status as string }),
      ...(customerId && { customerId: customerId as string }),
      ...(vehicleId && { vehicleId: vehicleId as string }),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          customer: true,
          vehicle: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('List bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /bookings/:id
 * Get a single booking by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
      },
      include: {
        customer: true,
        vehicle: true,
      },
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /bookings
 * Create a new booking
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = bookingSchema.parse(req.body);

    // Verify customer and vehicle belong to tenant
    const [customer, vehicle] = await Promise.all([
      prisma.customer.findFirst({
        where: { id: data.customerId, tenantId: req.tenantId! },
      }),
      prisma.vehicle.findFirst({
        where: { id: data.vehicleId, tenantId: req.tenantId! },
      }),
    ]);

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    // Check vehicle availability
    if (vehicle.status !== 'AVAILABLE') {
      res.status(400).json({
        error: 'Vehicle not available',
        status: vehicle.status,
      });
      return;
    }

    // Check for overlapping bookings
    const overlapping = await prisma.booking.findFirst({
      where: {
        vehicleId: data.vehicleId,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
        OR: [
          {
            startDate: { lte: data.endDate },
            endDate: { gte: data.startDate },
          },
        ],
      },
    });

    if (overlapping) {
      res.status(409).json({
        error: 'Vehicle already booked for these dates',
        conflictingBooking: overlapping.id,
      });
      return;
    }

    // Calculate pricing
    const totalDays = Math.ceil(
      (data.endDate.getTime() - data.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const subtotal = vehicle.dailyRate * totalDays;
    const tax = subtotal * 0.18; // 18% GST
    const addOnsTotal = (data.addOns || []).reduce(
      (sum, addon) => sum + addon.price,
      0
    );
    const total = subtotal + tax + addOnsTotal;

    // Generate booking number
    const bookingCount = await prisma.booking.count({
      where: { tenantId: req.tenantId! },
    });
    const bookingNumber = `BK-${new Date().getFullYear()}-${String(bookingCount + 1).padStart(4, '0')}`;

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        tenantId: req.tenantId!,
        startDate: data.startDate,
        endDate: data.endDate,
        dailyRate: vehicle.dailyRate,
        totalDays,
        subtotal,
        tax,
        total,
        addOns: data.addOns || [],
        notes: data.notes,
      },
      include: {
        customer: true,
        vehicle: true,
      },
    });

    // Update vehicle status
    await prisma.vehicle.update({
      where: { id: data.vehicleId },
      data: { status: 'RENTED' },
    });

    res.status(201).json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /bookings/:id/status
 * Update booking status
 */
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!['CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
      },
      include: { vehicle: true },
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        customer: true,
        vehicle: true,
      },
    });

    // Update vehicle status
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      await prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: { status: 'AVAILABLE' },
      });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
