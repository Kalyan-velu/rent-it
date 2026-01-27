import {prisma} from '@rent-a-wheel/database';
import {Router} from 'express';
import {UserRepository} from '../../infrastructure';
import {AuthService} from './auth.service';
import {createAuthController} from './controllers';

/**
 * Auth Module
 * Wires dependencies and creates the module router
 */
export function createAuthModule(): Router {
  // Create repository
  const userRepo = new UserRepository(prisma);

  // Create service with dependencies
  const service = new AuthService(userRepo);

  // Create controller (no guards - auth handles its own)
  return createAuthController(service);
}

export { AuthService } from './auth.service';
export * from './dto';
