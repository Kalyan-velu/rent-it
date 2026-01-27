import { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../exceptions';

/**
 * Tenant Guard
 * Ensures tenant context is present in the request
 */
export function tenantGuard(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.tenantId) {
    return next(new BadRequestException('Tenant context required'));
  }

  next();
}
