import { NextFunction, Request, Response } from 'express';
import { BookingsService } from '../bookings.service';
import { createBookingSchema } from '../dto/booking.dto';

/**
 * POST / - Create booking handler
 */
export const createHandler =
  (service: BookingsService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = createBookingSchema.parse(req.body);
      const booking = await service.create(dto, req.tenantId!);
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  };
