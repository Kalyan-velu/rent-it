import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth.service';

/**
 * GET /me - Get current user profile handler
 */
export const meHandler =
  (service: AuthService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const user = await service.getProfile(req.user.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      });
    } catch (error) {
      next(error);
    }
  };
