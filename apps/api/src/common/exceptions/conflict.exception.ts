import { HttpException } from './http.exception';

/**
 * 409 Conflict Exception
 * Used for duplicate entries or conflicting state
 */
export class ConflictException extends HttpException {
  constructor(message = 'Resource already exists', details?: unknown) {
    super(message, 409, 'CONFLICT', details);
  }
}
