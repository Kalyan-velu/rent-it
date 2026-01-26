import type { JWTPayload } from '@repo/auth';
import { verifyToken } from '@repo/auth';
import { NextFunction, Request, Response } from 'express';

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
 * Middleware to verify JWT token and attach user to request
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Read token from HTTP-only cookie
  const token = req.cookies?.auth_token;

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    req.tenantId = payload.tenantId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware to require specific roles
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Required roles: ${roles.join(', ')}`,
      });
      return;
    }

    next();
  };
}

/**
 * Middleware to require tenant context
 */
export function requireTenant(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.tenantId) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Tenant context required',
    });
    return;
  }

  next();
}
