import { NextFunction, Request, Response } from 'express';
import { updateSubscriptionSchema } from '../dto/tenant.dto';
import { TenantsService } from '../tenants.service';

export const updateSubscriptionHandler =
  (service: TenantsService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const dto = updateSubscriptionSchema.parse(req.body);
      const subscription = await service.updateSubscription(id, dto);
      res.json(subscription);
    } catch (error) {
      next(error);
    }
  };
