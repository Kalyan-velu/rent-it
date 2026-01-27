import { HttpException } from './http.exception';

/**
 * 401 Unauthorized Exception
 * Used when authentication is required but not provided or invalid
 */
export class UnauthorizedException extends HttpException {
  constructor(message = 'Authentication required', details?: unknown) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}
