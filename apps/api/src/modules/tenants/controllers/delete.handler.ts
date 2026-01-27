import { NextFunction, Request, Response } from 'express';
import { TenantsService } from '../tenants.service';

export const deleteHandler =
  (service: TenantsService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await service.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
