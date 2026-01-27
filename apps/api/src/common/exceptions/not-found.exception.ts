import { HttpException } from './http.exception';

/**
 * 404 Not Found Exception
 * Used when a requested resource does not exist
 */
export class NotFoundException extends HttpException {
  constructor(resource = 'Resource', details?: unknown) {
    super(`${resource} not found`, 404, 'NOT_FOUND', details);
  }
}
