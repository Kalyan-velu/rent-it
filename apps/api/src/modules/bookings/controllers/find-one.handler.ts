import { NextFunction, Request, Response } from 'express';
import { BookingsService } from '../bookings.service';

/**
 * GET /:id - Find one booking handler
 */
export const findOneHandler =
  (service: BookingsService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const booking = await service.findById(id, req.tenantId!);
      res.json(booking);
    } catch (error) {
      next(error);
    }
  };
