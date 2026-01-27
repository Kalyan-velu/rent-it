import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth.service';
import { registerSchema } from '../dto/auth.dto';

/**
 * POST /register - Register handler
 */
export const registerHandler =
  (service: AuthService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = registerSchema.parse(req.body);
      const result = await service.register(dto);

      // Set secure HTTP-only cookie
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });

      res.status(201).json({
        user: result.user,
        message: 'Registration successful',
      });
    } catch (error) {
      next(error);
    }
  };
