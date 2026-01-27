import { Router } from 'express';
import { BookingsService } from '../bookings.service';
import { createHandler } from './create.handler';
import { findAllHandler } from './find-all.handler';
import { findOneHandler } from './find-one.handler';
import { updateStatusHandler } from './update-status.handler';

/**
 * Create Bookings Controller
 * Wires all handlers to the router
 */
export function createBookingsController(service: BookingsService): Router {
  const router = Router();

  router.get('/', findAllHandler(service));
  router.get('/:id', findOneHandler(service));
  router.post('/', createHandler(service));
  router.patch('/:id/status', updateStatusHandler(service));

  return router;
}

export { createHandler, findAllHandler, findOneHandler, updateStatusHandler };
