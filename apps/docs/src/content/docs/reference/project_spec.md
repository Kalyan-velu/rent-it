---
title: Project Specification
description: Master specification document for the Rent-a-Wheel project.
---

import { Aside, Badge } from '@astrojs/starlight/components';

# Rent-a-Wheel Project Specification

**Version:** 1.1  
**Status:** In Development  
**Last Updated:** January 2026

## 1. Executive Summary

**Rent-a-Wheel** is a comprehensive, multi-tenant Car Rental Software (CRS) platform designed to serve three distinct user groups:

1. **Super Admins**: Platform owners managing subscriptions and tenants
2. **Service Admins (Tenants)**: Car rental business owners managing fleets, bookings, and customers
3. **Customers**: End-users browsing and booking vehicles

The system aims to modernize the car rental experience with a premium, responsive web interface, robust fleet management tools, and automated workflows for bookings and payments.

## 2. Technical Stack

### Current Implementation

| Component             | Technology                     | Status         |
| --------------------- | ------------------------------ | -------------- |
| **Monorepo**          | Turborepo + pnpm               | ✅ Complete    |
| **Backend API**       | Express.js + TypeScript        | ✅ Complete    |
| **CRM Frontend**      | Next.js 14+ (App Router)       | 🔨 In Progress |
| **Admin Panel**       | React + Vite                   | 🔨 In Progress |
| **Database**          | PostgreSQL + Prisma ORM        | ✅ Complete    |
| **Authentication**    | JWT + Passkey (WebAuthn)       | ✅ Complete    |
| **Authorization**     | Hybrid RBAC + ABAC             | ✅ Complete    |
| **API Documentation** | OpenAPI + Swagger UI           | ✅ Complete    |
| **API Client**        | Orval (generated from OpenAPI) | ✅ Complete    |
| **Documentation**     | Astro Starlight                | ✅ Complete    |
| **Testing**           | Vitest + Playwright            | 🔨 In Progress |

### Planned Integrations

| Integration     | Provider         | Phase         |
| --------------- | ---------------- | ------------- |
| Payment Gateway | Cashfree         | Phase 1       |
| File Storage    | AWS S3           | Phase 1       |
| Email Service   | AWS SES / Resend | Phase 1       |
| Monitoring      | Sentry           | ✅ Integrated |
| Background Jobs | Kafka            | Phase 2       |
| SMS             | Twilio           | Phase 2       |

## 3. Architecture Summary

### API Architecture

The backend follows a **modular NestJS-like architecture**:

```
apps/api/src/
├── modules/          # Feature modules
│   ├── auth/         # Authentication
│   ├── customers/    # Customer CRM
│   ├── vehicles/     # Fleet management
│   ├── bookings/     # Reservations
│   └── tenants/      # Multi-tenant management
├── common/           # Shared utilities
│   ├── dto/          # Data transfer objects
│   ├── exceptions/   # Custom exceptions
│   ├── filters/      # Exception filters
│   └── guards/       # Auth guards
└── infrastructure/   # Database & external services
```

### Shared Packages

| Package                    | Purpose                                    |
| -------------------------- | ------------------------------------------ |
| `@rent-a-wheel/database`   | Prisma schema and generated client         |
| `@rent-a-wheel/auth`       | JWT, password hashing, RBAC/ABAC utilities |
| `@rent-a-wheel/api-client` | Generated TypeScript API client            |
| `@rent-a-wheel/api-spec`   | OpenAPI specification                      |
| `@rent-a-wheel/ui`         | Shared UI components (planned)             |

## 4. Core Feature Areas

### Phase 1: The Working System (Core) <Badge text="Current" variant="tip" />

The foundation of the platform, focusing on enabling a rental business to operate.

#### Implemented ✅

- **Multi-tenancy**: Complete tenant isolation with subdomain routing
- **Authentication**: JWT + Passkey authentication with password strength validation
- **Authorization**: Hybrid RBAC + ABAC access control
- **Customer Management**: Full CRUD with lead scoring and tagging
- **Fleet Management**: Vehicle CRUD with status tracking
- **Booking Management**: Reservation creation with pricing calculation
- **API Infrastructure**: Rate limiting, CORS, CSRF, Helmet security

#### In Progress 🔨

- **Payment Gateway Integration**: Cashfree integration for deposits and payments
- **Availability Calendar**: Real-time vehicle availability view
- **Invoice Generation**: Auto-generated invoices for bookings
- **CRM Dashboard UI**: Service admin dashboard
- **Admin Dashboard UI**: Super admin panel

#### Planned 📋

- **Customer Portal**: Public-facing booking website
- **Email Notifications**: Booking confirmations, reminders
- **Agreement Templates**: Digital rental contracts

### Phase 2: Enhanced Operations

Focuses on automation and operational efficiency.

- **Advanced Pricing**: Seasonal rates, dynamic pricing rules
- **Check-in/Check-out Workflows**: Digital forms with photo upload
- **Maintenance Scheduling**: Service tracking and reminders
- **SMS Notifications**: Twilio integration
- **Advanced Reports**: Revenue, utilization analytics

### Phase 3: Scale & Intelligence

Focuses on scaling and AI-driven features.

- **Mobile Apps**: Native iOS and Android
- **Accounting Integration**: QuickBooks/Xero
- **Public API**: REST API for third-party integrations
- **AI/ML**: Dynamic pricing, automated ID verification

## 5. Data Architecture

The database uses PostgreSQL with Prisma ORM, designed with multi-tenancy at its core.

### Key Entities

| Entity           | Purpose                                   |
| ---------------- | ----------------------------------------- |
| **Tenant**       | Rental business account with subscription |
| **User**         | Unified table for all user roles          |
| **Customer**     | CRM records with lead scoring             |
| **Vehicle**      | Fleet inventory with status tracking      |
| **Booking**      | Reservations linking customer, vehicle    |
| **Subscription** | Billing and plan limits                   |
| **Form**         | Custom form builder                       |
| **AuditLog**     | Action tracking for compliance            |

See [Database Schema](/technical/database) for complete documentation.

## 6. Security Features

### Implemented

| Feature          | Implementation              |
| ---------------- | --------------------------- |
| Password Hashing | bcrypt with cost factor 10  |
| JWT Tokens       | 7-day expiry, RS256 signing |
| CSRF Protection  | Token-based for mutations   |
| Rate Limiting    | 100 requests / 15 minutes   |
| Security Headers | Helmet (CSP, HSTS, etc.)    |
| Tenant Isolation | Row-level filtering         |
| RBAC + ABAC      | Hybrid access control       |

## 7. Development Roadmap

<Aside>
  See [Sprint Plan](/planning/sprint-plan) for detailed weekly breakdown.
</Aside>

### Sprint 0-6: Infrastructure & Core Admin

- Project setup and database design ✅
- Authentication and multi-tenancy ✅
- API modules (customers, vehicles, bookings) ✅
- Service Admin dashboard UI 🔨

### Sprint 7-9: Customer Portal & Notifications

- Customer-facing website
- Booking flow
- Email notifications

### Sprint 10-11: Testing & Launch

- Unit and integration testing
- Production deployment
- Documentation

### Sprint 12-19: Phase 2 Features

- Advanced pricing engine
- Check-in/out workflows
- SMS notifications
- Analytics dashboard

### Sprint 20+: Phase 3 Features

- Mobile applications
- AI/ML features
- Third-party integrations

## 8. Budget & Planning

See [Budget & Costs](/product/budget) for detailed cost tracking.

### Key Metrics

- **Story Points per Sprint**: 10-15 (target)
- **Sprint Duration**: 1 week
- **Phase 1 Target**: 24 weeks
- **Monthly Infrastructure**: ~$61/month

## 9. Related Documentation

- [Getting Started](/guides/getting-started) - Setup guide
- [Architecture Overview](/technical/architecture) - Technical design
- [Database Schema](/technical/database) - Data model
- [API Reference](/technical/api) - Endpoint documentation
- [Authentication](/technical/auth) - Auth system details
