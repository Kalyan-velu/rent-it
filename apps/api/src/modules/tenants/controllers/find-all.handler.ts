import { NextFunction, Request, Response } from 'express';
import { paginationSchema } from '../../../common/dto/pagination.dto';
import { TenantsService } from '../tenants.service';

export const findAllHandler =
  (service: TenantsService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = paginationSchema.parse(req.query);
      const result = await service.findAll(pagination);
      res.json({
        tenants: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };
