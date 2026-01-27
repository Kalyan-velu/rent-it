import { NextFunction, Request, Response } from 'express';
import { CustomersService } from '../customers.service';

/**
 * GET /:id - Find one customer handler
 */
export const findOneHandler =
  (service: CustomersService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const customer = await service.findById(id, req.tenantId!);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  };
