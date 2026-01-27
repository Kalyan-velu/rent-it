import { z } from 'zod';

/**
 * Booking validation schemas
 */
export const createBookingSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
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

export const updateBookingStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusDto = z.infer<typeof updateBookingStatusSchema>;
