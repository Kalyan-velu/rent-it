import * as Sentry from '@sentry/node';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

// Import modules
import {
  createAuthModule,
  createBookingsModule,
  createCustomersModule,
  createTenantsModule,
  createVehiclesModule,
} from './modules';

// Import global exception filter
import { httpExceptionFilter } from './common/filters';

// Import utilities
import { getRedisClient } from './utils/redis';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 4000;

// Sentry initialization for error tracking (v10+ API)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });
}

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", process.env.API_URL || '*'],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  })
);

// Cookie parser (required for reading auth cookies)
app.use(cookieParser());

// CSRF Protection
const csrfProtection = csrf({ cookie: true });

// Apply CSRF to all mutation routes (POST, PUT, DELETE)
app.use('/', (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return csrfProtection(req as any, res as any, next);
  }
  next();
});

// Send CSRF token to client
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.csrfToken) {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
      httpOnly: false, // Client needs to read this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// OpenAPI Docs (Swagger UI)
// =====================
// Serve the spec YAML from the monorepo package at /api/docs/spec/openapi.yaml
const openapiDir = path.resolve(__dirname, '../../../packages/openapi');
app.get('/api/docs/spec/openapi.yaml', (_req: Request, res: Response) => {
  res.sendFile(path.join(openapiDir, 'openapi.yaml'));
});

// Mount Swagger UI at /api/docs
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerUrl: '/api/docs/spec/openapi.yaml',
  })
);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// =====================
// Mount Modules
// =====================
app.use('/api/auth', createAuthModule());
app.use('/api/customers', createCustomersModule());
app.use('/api/vehicles', createVehiclesModule());
app.use('/api/bookings', createBookingsModule());
app.use('/api/tenants', createTenantsModule());

// API root
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: 'Rent-a-Wheel API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      vehicles: '/api/vehicles',
      bookings: '/api/bookings',
      tenants: '/api/tenants (super admin only)',
    },
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
  });
});

// Global exception filter (replaces manual error handling)
// Also reports errors to Sentry if configured
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Report to Sentry
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  // Pass to our exception filter
  httpExceptionFilter(err, req, res, next);
});

// Start server
const startServer = async () => {
  try {
    // Initialize Redis
    await getRedisClient();
    console.log('📦 Redis initialized');

    app.listen(PORT, () => {
      console.log(`🚀 API Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
