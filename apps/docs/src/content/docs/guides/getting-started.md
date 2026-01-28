---
title: Getting Started
description: Quick start guide for setting up and running the Rent-a-Wheel platform locally.
---

This guide will help you set up the Rent-a-Wheel development environment on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ (LTS recommended)
- **pnpm** 10+ (package manager)
- **PostgreSQL** 14+ (or use Docker)
- **Redis** (optional, for session and rate limiting)
- **Docker** (optional, for containerized development)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Kalyan-velu/get-a-car.git
cd rent-a-wheel
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rentawheel?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# Sentry (optional)
SENTRY_DSN=""
```

### 4. Set Up Database

Generate the Prisma client and run migrations:

```bash
# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# (Optional) Open Prisma Studio to view/edit data
pnpm db:studio
```

### 5. Start Development Servers

```bash
pnpm dev
```

This will start all applications:

| Application     | URL                              | Description             |
| --------------- | -------------------------------- | ----------------------- |
| API Server      | `http://localhost:4000`          | Express.js backend      |
| CRM App         | `http://localhost:3000`          | Next.js CRM frontend    |
| Admin Dashboard | `http://localhost:3001`          | React super admin panel |
| API Docs        | `http://localhost:4000/api/docs` | Swagger UI              |

## Development Commands

### Package Scripts

```bash
# Run all apps in development mode
pnpm dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Type checking
pnpm check-types

# Format code
pnpm format
```

### Database Commands

```bash
# Generate Prisma client after schema changes
pnpm db:generate

# Push schema changes to database (dev only)
pnpm db:push

# Create and run migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

### API Client Generation

The project uses [Orval](https://orval.dev/) to generate type-safe API clients from the OpenAPI specification:

```bash
# Generate API client
pnpm openapi:generate

# Watch for changes and regenerate
pnpm openapi:watch

# Validate OpenAPI spec
pnpm openapi:validate
```

## Docker Development

For a fully containerized development environment:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

See the [Docker Guide](/guides/docker) for more details.

## Project Structure

```
rent-a-wheel/
├── apps/
│   ├── api/              # Express.js backend
│   │   └── src/
│   │       ├── modules/  # Feature modules (auth, customers, etc.)
│   │       ├── common/   # Shared utilities
│   │       └── infrastructure/  # Database & external services
│   ├── crm/              # Next.js CRM frontend
│   ├── admin/            # React admin dashboard
│   └── docs/             # This documentation
├── packages/
│   ├── database/         # Prisma schema & client
│   ├── auth/             # Authentication utilities
│   ├── api-client/       # Generated API client
│   ├── api-spec/         # OpenAPI specification
│   └── ui/               # Shared UI components
└── tests/                # E2E tests
```

## Next Steps

- Explore the [Architecture Overview](/technical/architecture)
- Review the [Database Schema](/technical/database)
- Check the [API Reference](/technical/api)
- Understand the [Authentication System](/technical/auth)
