import { prisma } from '@rent-a-wheel/database';
import { Router } from 'express';
import { authGuard, roleGuard } from '../../common/guards';
import {
  SubscriptionRepository,
  TenantRepository,
} from '../../infrastructure/database/repositories';
import { createTenantsController } from './controllers';
import { TenantsService } from './tenants.service';

/**
 * Tenants Module
 * Wires dependencies and creates the module router (super admin only)
 */
export function createTenantsModule(): Router {
  // Create repositories
  const tenantRepo = new TenantRepository(prisma);
  const subscriptionRepo = new SubscriptionRepository(prisma);

  // Create service with dependencies
  const service = new TenantsService(tenantRepo, subscriptionRepo);

  // Create controller
  const controller = createTenantsController(service);

  // Create module router with guards (super admin only)
  const router = Router();
  router.use(authGuard);
  router.use(roleGuard('SUPER_ADMIN'));
  router.use('/', controller);

  return router;
}

export * from './dto';
export { TenantsService } from './tenants.service';
