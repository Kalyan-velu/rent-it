import { HttpException } from './http.exception';

/**
 * 403 Forbidden Exception
 * Used when user is authenticated but lacks permission
 */
export class ForbiddenException extends HttpException {
  constructor(message = 'Access denied', details?: unknown) {
    super(message, 403, 'FORBIDDEN', details);
  }
}
