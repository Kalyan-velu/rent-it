import { prisma } from '@rent-a-wheel/database';
import { Router } from 'express';
import { authGuard, tenantGuard } from '../../common/guards';
import {
  BookingRepository,
  CustomerRepository,
  VehicleRepository,
} from '../../infrastructure/database/repositories';
import { BookingsService } from './bookings.service';
import { createBookingsController } from './controllers';

/**
 * Bookings Module
 * Wires dependencies and creates the module router
 */
export function createBookingsModule(): Router {
  // Create repositories
  const bookingRepo = new BookingRepository(prisma);
  const customerRepo = new CustomerRepository(prisma);
  const vehicleRepo = new VehicleRepository(prisma);

  // Create service with dependencies
  const service = new BookingsService(bookingRepo, customerRepo, vehicleRepo);

  // Create controller
  const controller = createBookingsController(service);

  // Create module router with guards
  const router = Router();
  router.use(authGuard);
  router.use(tenantGuard);
  router.use('/', controller);

  return router;
}

export { BookingsService } from './bookings.service';
export * from './dto';
