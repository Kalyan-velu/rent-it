import { NextFunction, Request, Response } from 'express';
import { BookingsService } from '../bookings.service';
import { updateBookingStatusSchema } from '../dto/booking.dto';

/**
 * PATCH /:id/status - Update booking status handler
 */
export const updateStatusHandler =
  (service: BookingsService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { status } = updateBookingStatusSchema.parse(req.body);
      const booking = await service.updateStatus(id, status, req.tenantId!);
      res.json(booking);
    } catch (error) {
      next(error);
    }
  };
