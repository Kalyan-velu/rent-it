import { NextFunction, Request, Response } from 'express';
import { VehiclesService } from '../vehicles.service';

/**
 * DELETE /:id - Delete vehicle handler
 */
export const deleteHandler =
  (service: VehiclesService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await service.delete(id, req.tenantId!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
