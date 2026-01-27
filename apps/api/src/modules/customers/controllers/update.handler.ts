import { NextFunction, Request, Response } from 'express';
import { CustomersService } from '../customers.service';
import { updateCustomerSchema } from '../dto/customer.dto';

/**
 * PUT /:id - Update customer handler
 */
export const updateHandler =
  (service: CustomersService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const dto = updateCustomerSchema.parse(req.body);
      const customer = await service.update(id, dto, req.tenantId!);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  };
