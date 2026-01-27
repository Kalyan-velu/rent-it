import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { BadRequestException, HttpException } from '../exceptions';

/**
 * Global HTTP Exception Filter
 * Catches all errors and formats consistent JSON responses
 */
export function httpExceptionFilter(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle our custom HttpException types
  if (err instanceof HttpException) {
    res.status(err.status).json(err.toJSON());
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const exception = new BadRequestException('Validation error', err.issues);
    res.status(exception.status).json(exception.toJSON());
    return;
  }

  // Handle CSRF errors
  if (err.name === 'ForbiddenError' && (err as any).code === 'EBADCSRFTOKEN') {
    res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Invalid CSRF token',
      statusCode: 403,
    });
    return;
  }

  // Log unexpected errors
  console.error('Unhandled error:', err);

  // Default 500 response
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong',
    statusCode: 500,
  });
}
