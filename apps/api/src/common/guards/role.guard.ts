import { NextFunction, Request, Response } from 'express';
import { ForbiddenException, UnauthorizedException } from '../exceptions';

/**
 * Role Guard Factory
 * Creates middleware that requires specific roles
 */
export function roleGuard(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedException('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenException(`Required roles: ${roles.join(', ')}`)
      );
    }

    next();
  };
}
