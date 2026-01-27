import { NextFunction, Request, Response } from 'express';
import { CustomersService } from '../customers.service';

/**
 * DELETE /:id - Delete customer handler
 */
export const deleteHandler =
  (service: CustomersService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await service.delete(id, req.tenantId!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
