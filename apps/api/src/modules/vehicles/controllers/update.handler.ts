import { NextFunction, Request, Response } from 'express';
import { updateVehicleSchema } from '../dto/vehicle.dto';
import { VehiclesService } from '../vehicles.service';

/**
 * PUT /:id - Update vehicle handler
 */
export const updateHandler =
  (service: VehiclesService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const dto = updateVehicleSchema.parse(req.body);
      const vehicle = await service.update(id, dto, req.tenantId!);
      res.json(vehicle);
    } catch (error) {
      next(error);
    }
  };
