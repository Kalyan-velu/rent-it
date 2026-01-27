import { NextFunction, Request, Response } from 'express';
import { TenantsService } from '../tenants.service';

export const statsHandler =
  (service: TenantsService) =>
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await service.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };
