import { HttpException } from './http.exception';

/**
 * 400 Bad Request Exception
 * Used for validation errors and malformed requests
 */
export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request', details?: unknown) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}
