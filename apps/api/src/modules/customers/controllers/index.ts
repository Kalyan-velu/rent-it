import { Router } from 'express';
import { CustomersService } from '../customers.service';
import { createHandler } from './create.handler';
import { deleteHandler } from './delete.handler';
import { findAllHandler } from './find-all.handler';
import { findOneHandler } from './find-one.handler';
import { updateHandler } from './update.handler';

/**
 * Create Customers Controller
 * Wires all handlers to the router
 */
export function createCustomersController(service: CustomersService): Router {
  const router = Router();

  router.get('/', findAllHandler(service));
  router.get('/:id', findOneHandler(service));
  router.post('/', createHandler(service));
  router.put('/:id', updateHandler(service));
  router.delete('/:id', deleteHandler(service));

  return router;
}

export {
  createHandler,
  deleteHandler,
  findAllHandler,
  findOneHandler,
  updateHandler,
};
