import { z } from 'zod';

/**
 * Vehicle validation schemas
 */
export const createVehicleSchema = z.object({
  make: z.string().min(2, 'Make must be at least 2 characters'),
  model: z.string().min(1, 'Model is required'),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(1, 'License plate is required'),
  vin: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  seats: z.number().int().min(1),
  transmission: z.string().min(1, 'Transmission is required'),
  fuelType: z.string().min(1, 'Fuel type is required'),
  dailyRate: z.number().positive('Daily rate must be positive'),
  weeklyRate: z.number().positive().optional(),
  monthlyRate: z.number().positive().optional(),
  status: z
    .enum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'UNAVAILABLE'])
    .optional(),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  mileage: z.number().int().min(0).optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
