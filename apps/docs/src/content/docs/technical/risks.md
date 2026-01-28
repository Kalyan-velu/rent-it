---
title: Technical Risks & Dependencies
description: Analysis of technical risks, dependencies, and mitigation strategies.
---

import { Aside, Badge } from '@astrojs/starlight/components';

This document outlines technical risks, dependencies, and mitigation strategies for the Rent-a-Wheel platform.

## Risk Categories

| Category        | Risk Level | Description                                  |
| --------------- | ---------- | -------------------------------------------- |
| 🔴 **Critical** | High       | Could block deployment or cause major issues |
| 🟡 **Moderate** | Medium     | Requires attention but manageable            |
| 🟢 **Low**      | Low        | Minor impact, easily mitigated               |

## Implementation Risks

### Multi-Tenancy <Badge text="🟢 Mitigated" variant="success" />

| Aspect         | Details                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| **Risk**       | Data leakage between tenants                                              |
| **Impact**     | Critical security breach                                                  |
| **Status**     | ✅ Mitigated                                                              |
| **Mitigation** | Row-level `tenantId` filtering on all queries, ABAC middleware validation |

**Implementation:**

```typescript
// All repository methods filter by tenantId
async findAll(pagination: PaginationDto, tenantId: string) {
  return this.prisma.customer.findMany({
    where: { tenantId },  // Always required
  });
}
```

### Authentication <Badge text="🟢 Mitigated" variant="success" />

| Aspect         | Details                                                       |
| -------------- | ------------------------------------------------------------- |
| **Risk**       | Weak password security, token vulnerabilities                 |
| **Impact**     | Account compromise                                            |
| **Status**     | ✅ Mitigated                                                  |
| **Mitigation** | bcrypt hashing, password strength validation, JWT with expiry |

### Race Conditions (Bookings) <Badge text="🟡 Moderate" variant="caution" />

| Aspect         | Details                                               |
| -------------- | ----------------------------------------------------- |
| **Risk**       | Double-booking of vehicles                            |
| **Impact**     | Customer dissatisfaction, operational issues          |
| **Status**     | ⚠️ Partially mitigated                                |
| **Mitigation** | Overlapping booking check before creation             |
| **Future**     | Database-level locking for high-concurrency scenarios |

**Current Implementation:**

```typescript
// Check for overlapping bookings
const overlapping = await this.bookingRepo.findOverlapping(
  dto.vehicleId,
  dto.startDate,
  dto.endDate,
  tenantId,
);
if (overlapping) {
  throw new ConflictException('Vehicle already booked');
}
```

<Aside type="note">
  For high-traffic scenarios, we should implement optimistic concurrency control or database-level locking.
</Aside>

## External Dependency Risks

### Payment Gateway (Cashfree) <Badge text="🟡 Pending" variant="note" />

| Aspect         | Details                                                |
| -------------- | ------------------------------------------------------ |
| **Risk**       | API failures, PCI compliance                           |
| **Impact**     | Payment processing blocked                             |
| **Status**     | 📋 Not yet implemented                                 |
| **Mitigation** | Use official SDK, implement webhooks, idempotency keys |

**Best Practices:**

- Use Cashfree's hosted checkout for PCI compliance
- Implement webhook handlers for payment confirmations
- Store `cashfreeOrderId` for reconciliation
- Implement retry logic with idempotency keys

### Email Service <Badge text="🟡 Pending" variant="note" />

| Aspect         | Details                                      |
| -------------- | -------------------------------------------- |
| **Risk**       | Deliverability issues, spam filtering        |
| **Impact**     | Customers miss important notifications       |
| **Status**     | 📋 Not yet implemented                       |
| **Mitigation** | Use reputable provider, SPF/DKIM/DMARC setup |

**Recommended Providers:**

- AWS SES (cost-effective for scale)
- Resend (modern DX, good deliverability)
- SendGrid (comprehensive features)

### SMS Notifications <Badge text="🟢 Low" variant="success" />

| Aspect         | Details                                   |
| -------------- | ----------------------------------------- |
| **Risk**       | High costs, carrier filtering             |
| **Impact**     | Message delivery failures                 |
| **Status**     | Phase 2                                   |
| **Mitigation** | Message queuing, cost alerts, retry logic |

## Infrastructure Risks

### Database Performance <Badge text="🟢 Low" variant="success" />

| Aspect         | Details                                        |
| -------------- | ---------------------------------------------- |
| **Risk**       | Slow queries as data grows                     |
| **Impact**     | Poor user experience                           |
| **Status**     | ✅ Indexes implemented                         |
| **Mitigation** | Proper indexes, pagination, query optimization |

**Indexed Fields:**

- `tenantId` on all tenant-scoped tables
- `email`, `phone` on customers
- `status` on vehicles and bookings
- `bookingNumber` on bookings

### Redis Availability <Badge text="🟢 Low" variant="success" />

| Aspect         | Details                                       |
| -------------- | --------------------------------------------- |
| **Risk**       | Redis connection failures                     |
| **Impact**     | Rate limiting disabled                        |
| **Status**     | ✅ Graceful degradation                       |
| **Mitigation** | Fallback to in-memory store, connection retry |

### File Storage (S3) <Badge text="🟡 Pending" variant="note" />

| Aspect         | Details                                       |
| -------------- | --------------------------------------------- |
| **Risk**       | Upload failures, unauthorized access          |
| **Impact**     | Image/document management issues              |
| **Status**     | 📋 Not yet implemented                        |
| **Mitigation** | Pre-signed URLs, bucket policies, CDN caching |

## Integration Complexity Estimates

| Integration             | Complexity | Estimated Time | Dependencies              |
| ----------------------- | ---------- | -------------- | ------------------------- |
| Payment Gateway         | Medium     | 3-5 days       | Cashfree account, SSL     |
| Email Service           | Low        | 2-3 days       | Domain verification       |
| SMS Gateway             | Low        | 2 days         | Twilio account            |
| File Storage            | Medium     | 3-4 days       | AWS account, S3 bucket    |
| Accounting (QuickBooks) | High       | 10-15 days     | OAuth2 setup, API mapping |
| Public API              | High       | 10-15 days     | Rate limiting, docs       |

## Dependency Matrix

| Feature             | Depends On          | Status      |
| ------------------- | ------------------- | ----------- |
| Multi-tenancy       | Database design     | ✅ Complete |
| Authentication      | JWT, bcrypt         | ✅ Complete |
| Authorization       | RBAC/ABAC           | ✅ Complete |
| Customer CRUD       | Multi-tenancy       | ✅ Complete |
| Vehicle CRUD        | Multi-tenancy       | ✅ Complete |
| Bookings            | Customers, Vehicles | ✅ Complete |
| Payments            | Bookings, Cashfree  | 📋 Planned  |
| Invoices            | Bookings, Payments  | 📋 Planned  |
| Email Notifications | Email service       | 📋 Planned  |
| SMS Notifications   | Twilio              | Phase 2     |
| Reports             | Bookings, Payments  | Phase 2     |

## Monitoring & Observability

### Implemented

| Tool            | Purpose           | Status         |
| --------------- | ----------------- | -------------- |
| Sentry          | Error tracking    | ✅ Integrated  |
| Health endpoint | Uptime monitoring | ✅ Implemented |
| Console logging | Debug output      | ✅ Default     |

### Planned

| Tool                          | Purpose                | Priority |
| ----------------------------- | ---------------------- | -------- |
| Structured logging            | Log aggregation        | High     |
| APM (Application Performance) | Performance monitoring | Medium   |
| Alerting                      | Incident response      | Medium   |

## Mitigation Checklist

### Before Production

- [ ] Enable Sentry DSN for error tracking
- [ ] Configure proper CORS origins
- [ ] Set strong JWT secret (min 256 bits)
- [ ] Enable HTTPS only
- [ ] Set up database backups
- [ ] Configure rate limiting for production load
- [ ] Review and test RBAC permissions
- [ ] Verify tenant isolation thoroughly

### Ongoing

- [ ] Monitor error rates in Sentry
- [ ] Review slow queries periodically
- [ ] Update dependencies for security patches
- [ ] Conduct periodic security audits
- [ ] Review access logs for anomalies

## Next Steps

- [Architecture Overview](/technical/architecture) - System design
- [Database Schema](/technical/database) - Data model
- [Authentication](/technical/auth) - Security implementation
