import { Request, Response, Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router: Router = Router();

/**
 * POST /auth/logout
 * Logout user by clearing auth cookie
 */
router.post('/logout', authenticateToken, (_req: Request, res: Response) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  res.json({ message: 'Logout successful' });
});

export default router;
