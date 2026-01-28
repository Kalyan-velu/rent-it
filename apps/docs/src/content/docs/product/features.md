---
title: Feature Priority Matrix
description: Scoring and prioritization of product features with current implementation status.
---

import { Badge } from '@astrojs/starlight/components';

Features are scored based on **Business Value**, **Technical Complexity**, and **User Impact** to determine the **Priority Score**.

## Implementation Status Legend

| Badge                                       | Meaning                          |
| ------------------------------------------- | -------------------------------- |
| <Badge text="Complete" variant="success" /> | Fully implemented and functional |
| <Badge text="In Progress" variant="note" /> | Currently being developed        |
| <Badge text="Planned" variant="caution" />  | Scheduled for implementation     |
| <Badge text="Future" variant="default" />   | Phase 2 or 3 feature             |

## Phase 1 Features (MVP)

### Must Have (MVP Core)

| Feature                        | Component      | Priority Score | Status                                      | Business Value | User Impact | Tech Complexity |
| :----------------------------- | :------------- | :------------- | :------------------------------------------ | :------------- | :---------- | :-------------- |
| Multi-tenancy                  | Infrastructure | 28             | <Badge text="Complete" variant="success" /> | 10             | 10          | 8               |
| Authentication & Authorization | Infrastructure | 27             | <Badge text="Complete" variant="success" /> | 10             | 10          | 7               |
| Fleet Management CRUD          | Service Admin  | 25             | <Badge text="Complete" variant="success" /> | 10             | 10          | 5               |
| Customer Database              | Service Admin  | 22             | <Badge text="Complete" variant="success" /> | 9              | 9           | 4               |
| Manual Booking Creation        | Service Admin  | 26             | <Badge text="Complete" variant="success" /> | 10             | 10          | 6               |
| Availability Calendar          | Service Admin  | 27             | <Badge text="In Progress" variant="note" /> | 10             | 10          | 7               |
| Payment Gateway                | Service Admin  | 28             | <Badge text="Planned" variant="caution" />  | 10             | 10          | 8               |
| Online Booking                 | Customer       | 27             | <Badge text="Planned" variant="caution" />  | 10             | 10          | 7               |
| Customer Portal - Browsing     | Customer       | 26             | <Badge text="Planned" variant="caution" />  | 10             | 10          | 6               |
| Invoice Generation             | Service Admin  | 23             | <Badge text="Planned" variant="caution" />  | 9              | 9           | 5               |
| Employee Management            | Service Admin  | 22             | <Badge text="Planned" variant="caution" />  | 8              | 8           | 6               |
| Subscription Management        | Super Admin    | 22             | <Badge text="In Progress" variant="note" /> | 9              | 7           | 6               |
| Email Notifications            | Notifications  | 21             | <Badge text="Planned" variant="caution" />  | 8              | 9           | 4               |
| Basic Reporting                | Service Admin  | 20             | <Badge text="Planned" variant="caution" />  | 7              | 8           | 5               |
| Company Profile                | Service Admin  | 17             | <Badge text="Planned" variant="caution" />  | 7              | 7           | 3               |

### Implemented Details

#### Multi-tenancy <Badge text="Complete" variant="success" />

- Row-level `tenantId` filtering on all queries
- Subdomain-based routing (`tenant.rentawheel.com`)
- ABAC middleware for tenant isolation

#### Authentication <Badge text="Complete" variant="success" />

- JWT-based authentication with 7-day expiry
- Password hashing with bcrypt (cost factor 10)
- Password strength validation
- Passkey (WebAuthn) support

#### Authorization <Badge text="Complete" variant="success" />

- Hybrid RBAC + ABAC access control
- Three user roles: SUPER_ADMIN, TENANT_ADMIN, TENANT_USER
- Resource-level permission system

#### Fleet Management <Badge text="Complete" variant="success" />

- Full CRUD for vehicles
- Status tracking (Available, Rented, Maintenance, Unavailable)
- Category, pricing, and feature management
- Image support (S3 URLs)

#### Customer Management <Badge text="Complete" variant="success" />

- Full CRUD with pagination and search
- Lead scoring and tagging
- Contact information and notes
- Lead source tracking

#### Booking Engine <Badge text="Complete" variant="success" />

- Create bookings with customer and vehicle
- Automatic pricing calculation
- Tax calculation (18% GST)
- Add-on support (GPS, child seat, etc.)
- Booking number generation
- Status workflow (Pending → Confirmed → Active → Completed)
- Overlap detection for double-booking prevention

## Phase 2 Features

| Feature                 | Component     | Priority Score | Status                                    | Business Value | User Impact | Tech Complexity |
| :---------------------- | :------------ | :------------- | :---------------------------------------- | :------------- | :---------- | :-------------- |
| Check-out Workflow      | Service Admin | 25             | <Badge text="Future" variant="default" /> | 9              | 9           | 7               |
| Check-in Workflow       | Service Admin | 25             | <Badge text="Future" variant="default" /> | 9              | 9           | 7               |
| Pricing Rules Engine    | Service Admin | 25             | <Badge text="Future" variant="default" /> | 8              | 9           | 8               |
| Deposit Management      | Service Admin | 22             | <Badge text="Future" variant="default" /> | 8              | 8           | 6               |
| Booking Modification    | Customer      | 22             | <Badge text="Future" variant="default" /> | 7              | 8           | 7               |
| Cancellation Management | Service Admin | 22             | <Badge text="Future" variant="default" /> | 8              | 8           | 6               |
| Damage Reporting        | Service Admin | 21             | <Badge text="Future" variant="default" /> | 8              | 8           | 5               |
| Maintenance Scheduling  | Service Admin | 21             | <Badge text="Future" variant="default" /> | 7              | 8           | 6               |
| Advanced Analytics      | Service Admin | 21             | <Badge text="Future" variant="default" /> | 7              | 7           | 7               |
| E-Signature             | Service Admin | 21             | <Badge text="Future" variant="default" /> | 7              | 7           | 7               |
| SMS Notifications       | Notifications | 20             | <Badge text="Future" variant="default" /> | 7              | 8           | 5               |
| Document Upload         | Customer      | 18             | <Badge text="Future" variant="default" /> | 6              | 7           | 5               |
| Custom Forms            | Service Admin | 18             | <Badge text="Future" variant="default" /> | 5              | 6           | 7               |
| Expense Tracking        | Service Admin | 17             | <Badge text="Future" variant="default" /> | 6              | 6           | 5               |

## Phase 3 Features

| Feature                   | Component     | Priority Score | Status                                    | Business Value | User Impact | Tech Complexity |
| :------------------------ | :------------ | :------------- | :---------------------------------------- | :------------- | :---------- | :-------------- |
| Mobile Apps               | Customer      | 24             | <Badge text="Future" variant="default" /> | 7              | 8           | 9               |
| AI Dynamic Pricing        | Service Admin | 23             | <Badge text="Future" variant="default" /> | 6              | 7           | 10              |
| GPS Tracking              | Service Admin | 22             | <Badge text="Future" variant="default" /> | 6              | 7           | 9               |
| Multi-location            | Service Admin | 20             | <Badge text="Future" variant="default" /> | 6              | 6           | 8               |
| Automated ID Verification | Customer      | 20             | <Badge text="Future" variant="default" /> | 5              | 6           | 9               |
| Support Tickets           | Customer      | 19             | <Badge text="Future" variant="default" /> | 6              | 7           | 6               |
| Accounting Integration    | Service Admin | 19             | <Badge text="Future" variant="default" /> | 5              | 6           | 8               |
| White-label               | Super Admin   | 18             | <Badge text="Future" variant="default" /> | 6              | 5           | 7               |
| Corporate Customers       | Service Admin | 17             | <Badge text="Future" variant="default" /> | 5              | 5           | 7               |
| Public API                | Integration   | 17             | <Badge text="Future" variant="default" /> | 4              | 4           | 9               |
| Rating & Reviews          | Customer      | 16             | <Badge text="Future" variant="default" /> | 5              | 6           | 5               |
| Loyalty Program           | Customer      | 15             | <Badge text="Future" variant="default" /> | 4              | 5           | 6               |
| Multi-language            | Enhancement   | 14             | <Badge text="Future" variant="default" /> | 3              | 4           | 7               |

## Priority Score Calculation

```
Priority Score = Business Value + User Impact + (10 - Tech Complexity)
```

- **Business Value (1-10)**: Revenue impact, market differentiation
- **User Impact (1-10)**: Daily usage frequency, user satisfaction
- **Tech Complexity (1-10)**: Development effort, integration difficulty

Higher scores indicate features that should be prioritized for implementation.
