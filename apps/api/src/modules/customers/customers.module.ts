import { prisma } from '@rent-a-wheel/database';
import { Router } from 'express';
import { authGuard, tenantGuard } from '../../common/guards';
import {
  CustomerRepository,
  SubscriptionRepository,
} from '../../infrastructure/database/repositories';
import { createCustomersController } from './controllers';
import { CustomersService } from './customers.service';

/**
 * Customers Module
 * Wires dependencies and creates the module router
 */
export function createCustomersModule(): Router {
  // Create repositories
  const customerRepo = new CustomerRepository(prisma);
  const subscriptionRepo = new SubscriptionRepository(prisma);

  // Create service with dependencies
  const service = new CustomersService(customerRepo, subscriptionRepo);

  // Create controller
  const controller = createCustomersController(service);

  // Create module router with guards
  const router = Router();
  router.use(authGuard);
  router.use(tenantGuard);
  router.use('/', controller);

  return router;
}

export { CustomersService } from './customers.service';
export * from './dto';
