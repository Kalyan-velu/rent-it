import { BookingStatus } from '@rent-a-wheel/database';
import { NextFunction, Request, Response } from 'express';
import { paginationSchema } from '../../../common/dto/pagination.dto';
import { BookingsService } from '../bookings.service';

/**
 * GET / - Find all bookings handler
 */
export const findAllHandler =
  (service: BookingsService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = paginationSchema.parse(req.query);
      const options = {
        status: req.query.status as BookingStatus | undefined,
        customerId: req.query.customerId as string | undefined,
        vehicleId: req.query.vehicleId as string | undefined,
      };
      const result = await service.findAll(pagination, options, req.tenantId!);
      res.json({
        bookings: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };
