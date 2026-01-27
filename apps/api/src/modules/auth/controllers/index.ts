import { Router } from 'express';
import { authGuard } from '../../../common/guards';
import { AuthService } from '../auth.service';
import { loginHandler } from './login.handler';
import { meHandler } from './me.handler';
import { registerHandler } from './register.handler';

/**
 * Create Auth Controller
 * Wires all handlers to the router
 */
export function createAuthController(service: AuthService): Router {
  const router = Router();

  // Public routes
  router.post('/register', registerHandler(service));
  router.post('/login', loginHandler(service));

  // Protected routes
  router.get('/me', authGuard, meHandler(service));

  return router;
}

export { loginHandler, meHandler, registerHandler };
