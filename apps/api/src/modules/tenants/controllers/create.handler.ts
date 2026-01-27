import { NextFunction, Request, Response } from 'express';
import { createTenantSchema } from '../dto/tenant.dto';
import { TenantsService } from '../tenants.service';

export const createHandler =
  (service: TenantsService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = createTenantSchema.parse(req.body);
      const tenant = await service.create(dto);
      res.status(201).json(tenant);
    } catch (error) {
      next(error);
    }
  };
