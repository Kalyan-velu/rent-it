import { NextFunction, Request, Response } from 'express';
import { createVehicleSchema } from '../dto/vehicle.dto';
import { VehiclesService } from '../vehicles.service';

/**
 * POST / - Create vehicle handler
 */
export const createHandler =
  (service: VehiclesService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = createVehicleSchema.parse(req.body);
      const vehicle = await service.create(dto, req.tenantId!);
      res.status(201).json(vehicle);
    } catch (error) {
      next(error);
    }
  };
