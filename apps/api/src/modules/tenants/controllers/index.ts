import { Router } from 'express';
import { TenantsService } from '../tenants.service';
import { createHandler } from './create.handler';
import { deleteHandler } from './delete.handler';
import { findAllHandler } from './find-all.handler';
import { findOneHandler } from './find-one.handler';
import { statsHandler } from './stats.handler';
import { updateSubscriptionHandler } from './update-subscription.handler';
import { updateHandler } from './update.handler';

/**
 * Create Tenants Controller
 * Wires all handlers to the router
 */
export function createTenantsController(service: TenantsService): Router {
  const router = Router();

  router.get('/stats/overview', statsHandler(service));
  router.get('/', findAllHandler(service));
  router.get('/:id', findOneHandler(service));
  router.post('/', createHandler(service));
  router.put('/:id', updateHandler(service));
  router.patch('/:id/subscription', updateSubscriptionHandler(service));
  router.delete('/:id', deleteHandler(service));

  return router;
}

export {
  createHandler,
  deleteHandler,
  findAllHandler,
  findOneHandler,
  statsHandler,
  updateHandler,
  updateSubscriptionHandler,
};
