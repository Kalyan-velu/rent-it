import { NextFunction, Request, Response } from 'express';
import { paginationSchema } from '../../../common/dto/pagination.dto';
import { CustomersService } from '../customers.service';

/**
 * GET / - Find all customers handler
 */
export const findAllHandler =
  (service: CustomersService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = paginationSchema.parse(req.query);
      const result = await service.findAll(pagination, req.tenantId!);
      res.json({
        customers: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };
