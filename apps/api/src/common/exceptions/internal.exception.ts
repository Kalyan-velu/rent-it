import { HttpException } from './http.exception';

/**
 * 500 Internal Server Error Exception
 * Used for unexpected server errors
 */
export class InternalException extends HttpException {
  constructor(message = 'Internal server error', details?: unknown) {
    super(message, 500, 'INTERNAL_ERROR', details);
  }
}
