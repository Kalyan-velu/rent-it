---
title: Architecture Overview
description: Technical architecture of the Rent-a-Wheel platform, including API design, module structure, and patterns used.
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

This document describes the technical architecture of the Rent-a-Wheel platform as currently implemented.

## High-Level Architecture

The Rent-a-Wheel platform follows a **monorepo architecture** using Turborepo, with clear separation between applications and shared packages.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Applications                            │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│   CRM App    │ Admin Panel  │   API Server  │      Docs        │
│  (Next.js)   │  (React)     │  (Express.js) │    (Astro)       │
└──────┬───────┴──────┬───────┴───────┬───────┴────────┬─────────┘
       │              │               │                │
       └──────────────┴───────┬───────┴────────────────┘
                              │
┌─────────────────────────────┴─────────────────────────────────┐
│                      Shared Packages                           │
├────────────┬────────────┬────────────┬────────────────────────┤
│  Database  │    Auth    │ API Client │    UI Components       │
│  (Prisma)  │  (JWT/RBAC)│  (Orval)   │   (Coming Soon)        │
└────────────┴────────────┴────────────┴────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   PostgreSQL      │
                    │   + Redis         │
                    └───────────────────┘
```

## Technology Stack

| Layer              | Technology               | Purpose                                  |
| ------------------ | ------------------------ | ---------------------------------------- |
| **Monorepo**       | Turborepo + pnpm         | Build system and workspace management    |
| **Backend API**    | Express.js + TypeScript  | RESTful API server                       |
| **CRM Frontend**   | Next.js 14+ (App Router) | Tenant-facing application                |
| **Admin Panel**    | React + Vite             | Super admin dashboard                    |
| **Database**       | PostgreSQL + Prisma      | Data persistence with ORM                |
| **Authentication** | JWT + Passkey (WebAuthn) | Multi-method auth                        |
| **Authorization**  | Hybrid RBAC + ABAC       | Fine-grained access control              |
| **API Client**     | Orval                    | Type-safe client generation from OpenAPI |
| **Documentation**  | Astro Starlight          | Developer documentation                  |
| **Testing**        | Vitest + Playwright      | Unit and E2E testing                     |

## API Architecture

The API follows a **modular NestJS-like architecture** with clear separation of concerns:

### Module Structure

Each feature module follows this structure:

```
modules/
└── customers/
    ├── index.ts              # Module exports
    ├── customers.module.ts   # Module bootstrap
    ├── customers.service.ts  # Business logic
    ├── controllers/
    │   ├── index.ts
    │   ├── create.controller.ts
    │   ├── get.controller.ts
    │   ├── update.controller.ts
    │   └── delete.controller.ts
    └── dto/
        ├── customer.dto.ts
        └── index.ts
```

### Current Modules

| Module      | Description                               | Status      |
| ----------- | ----------------------------------------- | ----------- |
| `auth`      | Authentication (login, register, profile) | ✅ Complete |
| `tenants`   | Multi-tenant management                   | ✅ Complete |
| `customers` | Customer CRM                              | ✅ Complete |
| `vehicles`  | Fleet management                          | ✅ Complete |
| `bookings`  | Reservation management                    | ✅ Complete |

### API Endpoints

<Tabs>
  <TabItem label="Auth">
    ```
    POST   /api/auth/register   # Register new user
    POST   /api/auth/login      # Login with credentials
    GET    /api/auth/profile    # Get current user profile
    ```
  </TabItem>
  <TabItem label="Customers">
    ```
    GET    /api/customers       # List customers (paginated)
    POST   /api/customers       # Create customer
    GET    /api/customers/:id   # Get customer by ID
    PUT    /api/customers/:id   # Update customer
    DELETE /api/customers/:id   # Delete customer
    ```
  </TabItem>
  <TabItem label="Vehicles">
    ```
    GET    /api/vehicles        # List vehicles (paginated)
    POST   /api/vehicles        # Create vehicle
    GET    /api/vehicles/:id    # Get vehicle by ID
    PUT    /api/vehicles/:id    # Update vehicle
    PATCH  /api/vehicles/:id/status  # Update vehicle status
    DELETE /api/vehicles/:id    # Delete vehicle
    ```
  </TabItem>
  <TabItem label="Bookings">
    ```
    GET    /api/bookings        # List bookings (paginated)
    POST   /api/bookings        # Create booking
    GET    /api/bookings/:id    # Get booking by ID
    PATCH  /api/bookings/:id/status  # Update booking status
    ```
  </TabItem>
  <TabItem label="Tenants">
    ```
    GET    /api/tenants         # List tenants (super admin)
    POST   /api/tenants         # Create tenant
    GET    /api/tenants/:id     # Get tenant by ID
    PUT    /api/tenants/:id     # Update tenant
    DELETE /api/tenants/:id     # Delete tenant
    ```
  </TabItem>
</Tabs>

## Service Layer Pattern

Each module's service encapsulates all business logic:

```typescript
export class BookingsService {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async create(dto: CreateBookingDto, tenantId: string): Promise<Booking> {
    // Validate customer and vehicle
    // Check availability
    // Calculate pricing
    // Generate booking number
    // Create booking record
    // Update vehicle status
  }
}
```

## Repository Pattern

The infrastructure layer provides data access through repositories:

```typescript
export class BookingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(
    pagination: PaginationDto,
    options: BookingQueryOptions,
    tenantId: string,
  ) {
    // Always filter by tenantId for multi-tenancy
    return this.prisma.booking.findMany({
      where: { tenantId, ...options },
      skip: pagination.skip,
      take: pagination.limit,
    });
  }
}
```

## Security Layers

### 1. Helmet Security Headers

```typescript
app.use(
  helmet({
    contentSecurityPolicy: {
      /* ... */
    },
    hsts: { maxAge: 31536000, includeSubDomains: true },
  }),
);
```

### 2. CORS Configuration

```typescript
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  }),
);
```

### 3. Rate Limiting

```typescript
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP
  }),
);
```

### 4. CSRF Protection

```typescript
const csrfProtection = csrf({ cookie: true });
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});
```

## Error Handling

Centralized exception handling with custom exception classes:

```typescript
// Custom exceptions
throw new NotFoundException('Customer');
throw new BadRequestException('Invalid status', { status });
throw new ConflictException('Email already exists');
throw new UnauthorizedException('Invalid credentials');

// Global exception filter
app.use(httpExceptionFilter);
```

## Monitoring & Observability

### Sentry Integration

```typescript
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
}
```

### Health Check Endpoint

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

## Next Steps

- [Authentication System](/technical/auth) - Deep dive into auth implementation
- [Database Schema](/technical/database) - Complete data model
- [API Reference](/technical/api) - Full API documentation
