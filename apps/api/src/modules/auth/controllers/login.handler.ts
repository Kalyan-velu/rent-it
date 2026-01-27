import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth.service';
import { loginSchema } from '../dto/auth.dto';

/**
 * POST /login - Login handler
 */
export const loginHandler =
  (service: AuthService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = loginSchema.parse(req.body);
      const result = await service.login(dto);

      // Set secure HTTP-only cookie
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });

      res.json({
        user: result.user,
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  };
