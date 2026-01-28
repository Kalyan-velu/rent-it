---
title: Database Schema
description: Complete database schema documentation for the Rent-a-Wheel platform.
---

import { Tabs, TabItem, Aside } from '@astrojs/starlight/components';

The database is built with **PostgreSQL** and managed through **Prisma ORM**. The schema is designed with multi-tenancy at its core.

## Overview

### Key Design Principles

| Principle         | Implementation                                 |
| ----------------- | ---------------------------------------------- |
| **Multi-tenancy** | `tenantId` foreign key on all relevant tables  |
| **Soft Deletes**  | `deletedAt` timestamp for recoverable deletion |
| **Audit Trail**   | `createdAt`, `updatedAt` on all tables         |
| **Type Safety**   | Prisma-generated TypeScript types              |

### Schema Location

```
packages/database/prisma/schema.prisma
```

## Enums

The schema uses strongly-typed enums for status fields:

<Tabs>
  <TabItem label="User Roles">
    ```prisma
    enum UserRole {
      SUPER_ADMIN   // Platform super admin
      TENANT_ADMIN  // Rental provider admin
      TENANT_USER   // Rental provider staff
    }
    ```
  </TabItem>
  <TabItem label="Subscription">
    ```prisma
    enum SubscriptionPlan {
      BASIC         // 100 customers, 100 forms
      PROFESSIONAL  // 1000 customers, integrations
      ENTERPRISE    // Unlimited, website builder
    }

    enum SubscriptionStatus {
      ACTIVE
      CANCELED
      PAST_DUE
      TRIALING
    }
    ```

  </TabItem>
  <TabItem label="Status Enums">
    ```prisma
    enum BookingStatus {
      PENDING
      CONFIRMED
      ACTIVE
      COMPLETED
      CANCELLED
    }

    enum VehicleStatus {
      AVAILABLE
      RENTED
      MAINTENANCE
      UNAVAILABLE
    }

    enum PaymentStatus {
      PENDING
      COMPLETED
      FAILED
      REFUNDED
    }
    ```

  </TabItem>
</Tabs>

## Core Tables

### Tenant

The central entity for multi-tenancy. Each rental business is a tenant.

```prisma
model Tenant {
  id           String  @id @default(cuid())
  name         String  // Business name
  subdomain    String  @unique  // e.g., "johnsrentals"
  customDomain String? @unique  // For enterprise plan
  logoUrl      String?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? // Soft delete

  // Relations
  users        User[]
  subscription Subscription?
  customers    Customer[]
  vehicles     Vehicle[]
  bookings     Booking[]
  forms        Form[]
  website      Website?

  @@index([subdomain])
  @@map("tenants")
}
```

### User

Unified user table for all roles (super admins, tenant admins, staff).

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String?  // Nullable for OAuth/Passkey only users
  name         String
  role         UserRole @default(TENANT_USER)

  // OAuth fields
  googleId String? @unique
  githubId String? @unique

  // Passkey (WebAuthn) credentials
  passkeys Json[] @default([])

  // Multi-tenant
  tenantId String?
  tenant   Tenant? @relation(fields: [tenantId], references: [id])

  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  // Audit
  lastLoginAt DateTime?
  loginCount  Int @default(0)

  @@index([email])
  @@index([tenantId])
  @@map("users")
}
```

<Aside type="note">
  Users with `role: SUPER_ADMIN` have `tenantId: null` as they manage the platform, not a specific tenant.
</Aside>

### Subscription

Tracks tenant subscription plans and billing.

```prisma
model Subscription {
  id     String             @id @default(cuid())
  plan   SubscriptionPlan
  status SubscriptionStatus @default(TRIALING)

  // Cashfree payment references
  cashfreeSubscriptionId String? @unique

  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean @default(false)

  // Limits based on plan
  customerLimit Int  // -1 for unlimited
  formLimit     Int  // -1 for unlimited

  tenantId String @unique
  tenant   Tenant @relation(fields: [tenantId], references: [id])

  invoices Invoice[]

  @@map("subscriptions")
}
```

## CRM Tables

### Customer

Customer database for each tenant.

```prisma
model Customer {
  id      String  @id @default(cuid())
  name    String
  email   String
  phone   String
  address String?
  city    String?
  state   String?
  country String?
  zipCode String?

  // Lead/Customer metadata
  leadSource String?        // e.g., "website", "referral"
  leadScore  Int @default(0)
  tags       String[] @default([])
  notes      String? @db.Text

  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  bookings Booking[]

  @@index([tenantId])
  @@index([email])
  @@index([phone])
  @@map("customers")
}
```

## Fleet Management

### Vehicle

Fleet inventory for each tenant.

```prisma
model Vehicle {
  id           String  @id @default(cuid())
  make         String  // e.g., "Toyota"
  model        String  // e.g., "Camry"
  year         Int
  licensePlate String
  vin          String? // Vehicle Identification Number

  category     String  // e.g., "SUV", "Sedan", "Luxury"
  seats        Int
  transmission String  // "Automatic", "Manual"
  fuelType     String  // "Petrol", "Diesel", "Electric"

  dailyRate   Float
  weeklyRate  Float?
  monthlyRate Float?

  status VehicleStatus @default(AVAILABLE)

  images   String[] @default([])  // S3 URLs
  features String[] @default([])  // e.g., ["GPS", "Bluetooth"]

  mileage         Int @default(0)
  lastServiceDate DateTime?

  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  bookings Booking[]

  @@index([tenantId])
  @@index([status])
  @@map("vehicles")
}
```

## Booking Management

### Booking

Core reservation records.

```prisma
model Booking {
  id            String @id @default(cuid())
  bookingNumber String @unique  // e.g., "BK-2026-0001"

  startDate DateTime
  endDate   DateTime

  status BookingStatus @default(PENDING)

  // Pricing
  dailyRate Float
  totalDays Int
  subtotal  Float
  tax       Float @default(0)
  discount  Float @default(0)
  total     Float

  // Payment
  paymentStatus   PaymentStatus @default(PENDING)
  cashfreeOrderId String? @unique

  // Add-ons
  addOns Json[] @default([])  // e.g., [{"name": "GPS", "price": 500}]

  notes String? @db.Text

  customerId String
  customer   Customer @relation(fields: [customerId], references: [id])

  vehicleId String
  vehicle   Vehicle @relation(fields: [vehicleId], references: [id])

  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tenantId])
  @@index([bookingNumber])
  @@index([customerId])
  @@index([vehicleId])
  @@map("bookings")
}
```

## Form Builder

### Form

Custom forms for each tenant.

```prisma
model Form {
  id          String  @id @default(cuid())
  name        String
  description String?

  fields   Json  // Array of field definitions
  settings Json @default("{}")  // Redirects, emails, etc.

  isPublished Boolean @default(false)

  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])

  submissions FormSubmission[]

  @@map("forms")
}

model FormSubmission {
  id     String @id @default(cuid())
  formId String
  form   Form @relation(fields: [formId], references: [id])

  data      Json    // Submitted form data
  ipAddress String?
  userAgent String?

  createdAt DateTime @default(now())

  @@index([formId])
  @@map("form_submissions")
}
```

## Website Builder

### Website

No-code website for enterprise tenants.

```prisma
model Website {
  id String @id @default(cuid())

  pages    Json @default("[]")
  theme    Json @default("{}")
  settings Json @default("{}")

  isPublished Boolean   @default(false)
  publishedAt DateTime?

  tenantId String @unique
  tenant   Tenant @relation(fields: [tenantId], references: [id])

  @@map("websites")
}
```

## Audit & Security

### AuditLog

Track all critical actions for security and compliance.

```prisma
model AuditLog {
  id String @id @default(cuid())

  userId   String
  tenantId String?

  action     String  // e.g., "customer.create"
  resource   String  // e.g., "Customer"
  resourceId String?

  // ABAC attributes
  attributes Json @default("{}")

  ipAddress String?
  userAgent String?

  createdAt DateTime @default(now())

  @@index([userId])
  @@index([tenantId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}
```

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐
│   Tenant    │──1:1──│ Subscription │
└──────┬──────┘       └──────────────┘
       │
       │1:N
       ├──────────────────┬──────────────────┬─────────────────┐
       ▼                  ▼                  ▼                 ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐   ┌─────────────┐
│    User     │    │  Customer   │    │   Vehicle   │   │    Form     │
└─────────────┘    └──────┬──────┘    └──────┬──────┘   └──────┬──────┘
                          │                  │                 │
                          │N:1           N:1 │                 │1:N
                          │                  │                 ▼
                          └────────┬─────────┘          ┌─────────────┐
                                   ▼                    │    Form     │
                            ┌─────────────┐             │ Submission  │
                            │   Booking   │             └─────────────┘
                            └─────────────┘
```

## Database Commands

```bash
# Generate Prisma client after schema changes
pnpm db:generate

# Push schema changes to database (dev only)
pnpm db:push

# Create and run migrations
pnpm db:migrate

# Open Prisma Studio (GUI)
pnpm db:studio
```

## Next Steps

- [Architecture Overview](/technical/architecture) - System design
- [API Reference](/technical/api) - Endpoint documentation
- [Authentication](/technical/auth) - Auth implementation
