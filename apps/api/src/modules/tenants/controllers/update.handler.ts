import { NextFunction, Request, Response } from 'express';
import { updateTenantSchema } from '../dto/tenant.dto';
import { TenantsService } from '../tenants.service';

export const updateHandler =
  (service: TenantsService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const dto = updateTenantSchema.parse(req.body);
      const tenant = await service.update(id, dto);
      res.json(tenant);
    } catch (error) {
      next(error);
    }
  };
