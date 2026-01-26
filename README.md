# Rent-a-Wheel Platform

A comprehensive multi-tenant SaaS platform for vehicle rental providers with CRM, subscription management, integrations, itinerary builder, and no-code website builder.

## 🏗️ Project Structure

```
rent-a-wheel/
├── apps/
│   ├── api/          # Express.js backend API
│   ├── crm/          # Next.js CRM application for rental providers
│   └── admin/        # React super admin dashboard
├── packages/
│   ├── database/     # Prisma schema and database utilities
│   ├── auth/         # Authentication utilities (JWT, Passkey, RBAC+ABAC)
│   ├── ui/           # Shared UI components
│   ├── eslint-config/
│   └── typescript-config/
```

## 🚀 Tech Stack

- **Monorepo**: Turborepo
- **Backend**: Express.js with TypeScript
- **CRM Frontend**: Next.js 14+ (App Router)
- **Super Admin**: React with Vite
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: OAuth + Passkey (WebAuthn) + Email
- **Access Control**: Hybrid ABAC + RBAC
- **Payment Gateway**: Cashfree
- **File Storage**: AWS S3
- **Email**: AWS SES or Resend
- **Background Jobs**: Kafka
- **Monitoring**: Sentry
- **Rate Limiting**: Express rate-limit

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
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
- API server on `http://localhost:4000`
- CRM app on `http://localhost:3000`
- Admin dashboard on `http://localhost:3001`

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

The platform supports three authentication methods:

1. **Email + Password**: Traditional email/password authentication
2. **OAuth**: Google, GitHub, etc.
3. **Passkey (WebAuthn)**: Passwordless authentication with biometrics

## 🏢 Multi-Tenancy

The platform uses tenant isolation with:
- Subdomain-based routing (`provider.rentawheel.com`)
- Row-level security (tenant_id in all tables)
- Hybrid RBAC + ABAC access control

## 📊 Subscription Tiers

1. **Basic** - $29/month
   - 100 customers
   - 100 forms/submissions
   - CRM features
   - Email integration

2. **Professional** - $99/month
   - 1,000 customers
   - 1,000 forms/submissions
   - All Basic features
   - WhatsApp & Slack integration
   - Funnel management

3. **Enterprise** - $299/month
   - Unlimited customers
   - Unlimited forms/submissions
   - All Professional features
   - Website builder
   - Custom domain support
   - Priority support

## 📚 Documentation

- [API Documentation](./docs/api.md) (coming soon)
- [Architecture Guide](./docs/architecture.md) (coming soon)
- [Contributing Guide](./CONTRIBUTING.md) (coming soon)
- [AI Agents Guide](./agents.md)
- [Project Rules](./rules.md)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI (Vitest)
pnpm test:ui
```

## 🚢 Deployment

(Deployment instructions coming soon)

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ using Turborepo
