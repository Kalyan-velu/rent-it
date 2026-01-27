import { prisma } from '@rent-a-wheel/database';
import { Router } from 'express';
import { authGuard, tenantGuard } from '../../common/guards';
import { VehicleRepository } from '../../infrastructure/database/repositories';
import { createVehiclesController } from './controllers';
import { VehiclesService } from './vehicles.service';

/**
 * Vehicles Module
 * Wires dependencies and creates the module router
 */
export function createVehiclesModule(): Router {
  // Create repository
  const vehicleRepo = new VehicleRepository(prisma);

  // Create service with dependencies
  const service = new VehiclesService(vehicleRepo);

  // Create controller
  const controller = createVehiclesController(service);

  // Create module router with guards
  const router = Router();
  router.use(authGuard);
  router.use(tenantGuard);
  router.use('/', controller);

  return router;
}

export * from './dto';
export { VehiclesService } from './vehicles.service';
