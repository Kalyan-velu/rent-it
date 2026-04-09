# Rent-a-Wheel Platform

A comprehensive multi-tenant SaaS platform for vehicle rental providers with CRM, subscription management, and booking engine.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.7-blueviolet.svg)](https://turbo.build/)

## 🏗️ Project Structure

```
rent-a-wheel/
├── apps/
│   ├── api/          # Express.js backend API
│   ├── crm/          # Next.js CRM application for rental providers
│   ├── admin/        # React super admin dashboard
│   └── docs/         # Astro Starlight documentation
├── packages/
│   ├── database/     # Prisma schema and database utilities
│   ├── auth/         # Authentication utilities (JWT, Passkey, RBAC+ABAC)
│   ├── api-client/   # Generated API client (Orval)
│   ├── api-spec/     # OpenAPI specification
│   ├── ui/           # Shared UI components
│   ├── eslint-config/
│   └── typescript-config/
└── tests/            # E2E tests with Playwright
```

## 🚀 Tech Stack

| Component          | Technology                 |
| ------------------ | -------------------------- |
| **Monorepo**       | Turborepo + pnpm           |
| **Backend**        | Express.js with TypeScript |
| **CRM Frontend**   | Next.js 14+ (App Router)   |
| **Super Admin**    | React with Vite            |
| **Database**       | PostgreSQL with Prisma ORM |
| **Authentication** | JWT + Passkey (WebAuthn)   |
| **Access Control** | Hybrid ABAC + RBAC         |
| **API Docs**       | OpenAPI + Swagger UI       |
| **Documentation**  | Astro Starlight            |
| **Testing**        | Vitest + Playwright        |
| **Monitoring**     | Sentry                     |

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 14+
- Docker (optional, for local services)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your configuration

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev
```

This will start:

| Application     | URL                              | Description          |
| --------------- | -------------------------------- | -------------------- |
| API Server      | `http://localhost:4000`          | Express.js backend   |
| CRM App         | `http://localhost:3000`          | Next.js CRM frontend |
| Admin Dashboard | `http://localhost:3001`          | React super admin    |
| API Docs        | `http://localhost:4000/api/docs` | Swagger UI           |

## 🛠️ Development

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

# Generate API client from OpenAPI spec
pnpm openapi:generate

# Open Prisma Studio (database GUI)
pnpm db:studio
```

## 📝 Database Management

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

## 🔐 Authentication

The platform supports multiple authentication methods:

| Method                 | Status      | Description                       |
| ---------------------- | ----------- | --------------------------------- |
| **Email + Password**   | ✅ Complete | Traditional credential-based auth |
| **Passkey (WebAuthn)** | ✅ Complete | Passwordless biometric auth       |
| **OAuth**              | 🔨 Planned  | Google, GitHub social login       |

## 🏢 Multi-Tenancy

The platform uses tenant isolation with:

- **Subdomain-based routing** (`provider.rentawheel.com`)
- **Row-level security** (`tenant_id` on all tables)
- **Hybrid RBAC + ABAC** access control

### User Roles

| Role           | Description                      |
| -------------- | -------------------------------- |
| `SUPER_ADMIN`  | Platform owner with full access  |
| `TENANT_ADMIN` | Rental business owner            |
| `TENANT_USER`  | Staff member with limited access |

## 📊 Subscription Tiers

| Tier             | Price      | Limits                        |
| ---------------- | ---------- | ----------------------------- |
| **Basic**        | $29/month  | 100 customers, 100 forms      |
| **Professional** | $99/month  | 1,000 customers, integrations |
| **Enterprise**   | $299/month | Unlimited, website builder    |

## 📚 Documentation

Full documentation is available in the `apps/docs` folder and can be viewed by running `pnpm dev`.

Key documentation pages:

- [Getting Started](./apps/docs/src/content/docs/guides/getting-started.md)
- [Architecture Overview](./apps/docs/src/content/docs/technical/architecture.md)
- [Database Schema](./apps/docs/src/content/docs/technical/database.md)
- [API Reference](./apps/docs/src/content/docs/technical/api.md)
- [Authentication](./apps/docs/src/content/docs/technical/auth.md)

Additional guides:

- [AI Agents Guide](./agents.md)
- [Project Rules](./rules.md)
- [Docker Guide](./DOCKER.md)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e
```

## 🤖 CI/CD

The platform uses GitHub Actions to ensure code quality and security:

- **Security Audit**: Scans for accidentally committed secrets.
- **AI Code Review**: Provides automated feedback on pull requests.
- **Documentation Sync**: Automatically keeps docs in sync with API and code changes.

## 🐳 Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

See [DOCKER.md](./DOCKER.md) for detailed Docker instructions.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ using Turborepo
