# Rent-a-Wheel Project Specification

**Version:** 1.1  
**Status:** In Development  
**Last Updated:** January 2026

## 1. Executive Summary

**Rent-a-Wheel** is a comprehensive, multi-tenant Car Rental Software (CRS) platform designed to serve three distinct user groups:

1. **Super Admins**: Platform owners managing subscriptions and tenants.
2. **Service Admins (Tenants)**: Car rental business owners managing fleets, bookings, and customers.
3. **Customers**: End-users browsing and booking vehicles.

The system aims to modernize the car rental experience with a premium, responsive web interface, robust fleet management tools, and automated workflows for bookings and payments.

## 2. Technical Stack

### Current Implementation

| Component      | Technology               | Status         |
| -------------- | ------------------------ | -------------- |
| Monorepo       | Turborepo + pnpm         | ✅ Complete    |
| Backend API    | Express.js + TypeScript  | ✅ Complete    |
| CRM Frontend   | Next.js 14+ (App Router) | 🔨 In Progress |
| Admin Panel    | React + Vite             | 🔨 In Progress |
| Database       | PostgreSQL + Prisma ORM  | ✅ Complete    |
| Authentication | JWT + Passkey (WebAuthn) | ✅ Complete    |
| Authorization  | Hybrid RBAC + ABAC       | ✅ Complete    |
| API Docs       | OpenAPI + Swagger UI     | ✅ Complete    |
| Documentation  | Astro Starlight          | ✅ Complete    |
| CI/CD Pipeline | GitHub Actions           | ✅ Complete    |

### Planned Integrations

- **Payment Gateway**: Cashfree (Phase 1)
- **File Storage**: AWS S3 (Phase 1)
- **Email Service**: AWS SES / Resend (Phase 1)
- **Monitoring**: Sentry (✅ Integrated)
- **Background Jobs**: Kafka (Phase 2)

## 3. Core Feature Areas

### Phase 1: The Working System (Core)

The foundation of the platform, focusing on enabling a rental business to operate.

**Implemented:**

- Multi-tenancy with tenant isolation
- JWT + Passkey authentication
- Hybrid RBAC + ABAC authorization
- Customer CRM with lead scoring
- Fleet management with status tracking
- Booking engine with pricing calculation
- API security (rate limiting, CORS, CSRF, Helmet)

**In Progress:**

- Payment gateway integration (Cashfree)
- Availability calendar
- CRM dashboard UI
- Admin dashboard UI

### Phase 2: Enhanced Operations

Focuses on automation, rule-based logic, and operational efficiency.

- Advanced Pricing: Seasonal rates, weekend adjustments, dynamic pricing rules
- Workflow Automation: Digital check-in/out forms with photo upload
- Notifications: Automated SMS/Email reminders
- Reporting: Financial reports, fleet utilization, customer analytics

### Phase 3: Scale & Intelligence

Focuses on scaling, mobile access, and AI-driven optimizations.

- Mobile Apps: Native iOS and Android apps
- Integration: Accounting software (QuickBooks/Xero), Public API
- AI/ML: Dynamic pricing algorithms, automated ID verification

## 4. Data Architecture

The database is designed with **Multi-Tenancy** at its core. Every major entity has `tenantId` for strict data isolation.

### Key Entities

| Entity       | Purpose                                   |
| ------------ | ----------------------------------------- |
| Tenant       | Rental business account with subscription |
| User         | Unified table for all user roles          |
| Customer     | CRM records with lead scoring             |
| Vehicle      | Fleet inventory with status tracking      |
| Booking      | Reservations linking customer, vehicle    |
| Subscription | Billing and plan limits                   |
| Form         | Custom form builder                       |
| AuditLog     | Action tracking for compliance            |

## 5. Development Roadmap

- **Sprint 0-6**: Infrastructure setup, Auth, Core Admin features ✅
- **Sprint 7-9**: Customer Portal and Notifications
- **Sprint 10-11**: Testing, Beta Launch, and Deployment
- **Sprint 12-19**: Phase 2 features (Pricing, Inspections, Reports)
- **Sprint 20+**: Phase 3 features (Mobile, AI, Integrations)

## 6. Budget & Planning

- **Tracking**: Detailed weekly tracking of Velocity and Story Points
- **Cost Management**: Monthly operational cost tracking (~$61/month infrastructure)
- **Risk Mitigation**: Proactive identification of technical dependencies

## 7. Documentation

For complete documentation, see `/apps/docs` or run `pnpm dev` to start the docs server.
