import { NextFunction, Request, Response } from 'express';
import { VehiclesService } from '../vehicles.service';

/**
 * GET /:id - Find one vehicle handler
 */
export const findOneHandler =
  (service: VehiclesService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const vehicle = await service.findById(id, req.tenantId!);
      res.json(vehicle);
    } catch (error) {
      next(error);
    }
  };
