import { NextFunction, Request, Response } from 'express';
import { TenantsService } from '../tenants.service';

export const findOneHandler =
  (service: TenantsService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const tenant = await service.findById(id);
      res.json(tenant);
    } catch (error) {
      next(error);
    }
  };
