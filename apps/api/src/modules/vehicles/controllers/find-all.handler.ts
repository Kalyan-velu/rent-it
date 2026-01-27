import { VehicleStatus } from '@rent-a-wheel/database';
import { NextFunction, Request, Response } from 'express';
import { paginationSchema } from '../../../common/dto/pagination.dto';
import { VehiclesService } from '../vehicles.service';

/**
 * GET / - Find all vehicles handler
 */
export const findAllHandler =
  (service: VehiclesService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = paginationSchema.parse(req.query);
      const options = {
        status: req.query.status as VehicleStatus | undefined,
        category: req.query.category as string | undefined,
      };
      const result = await service.findAll(pagination, options, req.tenantId!);
      res.json({
        vehicles: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };
