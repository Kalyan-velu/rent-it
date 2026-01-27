import { NextFunction, Request, Response } from 'express';
import { CustomersService } from '../customers.service';
import { createCustomerSchema } from '../dto/customer.dto';

/**
 * POST / - Create customer handler
 */
export const createHandler =
  (service: CustomersService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = createCustomerSchema.parse(req.body);
      const customer = await service.create(dto, req.tenantId!);
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  };
