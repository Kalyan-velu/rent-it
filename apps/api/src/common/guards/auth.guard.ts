import type { JWTPayload } from '@rent-a-wheel/auth';
import { verifyToken } from '@rent-a-wheel/auth';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../exceptions';

// Extend Express Request to include user and tenant
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      tenantId?: string;
    }
  }
}

/**
 * Authentication Guard
 * Verifies JWT token from HTTP-only cookie and attaches user to request
 */
export function authGuard(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.auth_token;

  if (!token) {
    return next(new UnauthorizedException('Authentication required'));
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    req.tenantId = payload.tenantId;
    next();
  } catch {
    next(new UnauthorizedException('Invalid or expired token'));
  }
}
