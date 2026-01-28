---
title: API Reference
description: Complete API documentation for the Rent-a-Wheel platform.
---

import { Tabs, TabItem, Aside, Badge } from '@astrojs/starlight/components';

The Rent-a-Wheel API is a RESTful API built with Express.js. This document provides a complete reference for all available endpoints.

<Aside type="tip">
  Interactive API documentation is available at `http://localhost:4000/api/docs` when running the development server.
</Aside>

## Base URL

| Environment | URL                              |
| ----------- | -------------------------------- |
| Development | `http://localhost:4000/api`      |
| Production  | `https://api.rentawheel.com/api` |

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

## Response Format

All responses follow a consistent format:

<Tabs>
  <TabItem label="Success">
    ```json
    {
      "data": { ... },
      "meta": {
        "total": 100,
        "page": 1,
        "limit": 10
      }
    }
    ```
  </TabItem>
  <TabItem label="Error">
    ```json
    {
      "error": "Error Title",
      "message": "Detailed error message",
      "details": { ... }
    }
    ```
  </TabItem>
</Tabs>

## Endpoints

### Health Check

```http
GET /health
```

Returns server health status.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2026-01-29T00:00:00.000Z",
  "uptime": 12345.67
}
```

---

## Authentication

### Register

```http
POST /api/auth/register
```

Create a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "name": "John Doe",
  "tenantId": "optional-tenant-id"
}
```

**Response:** `201 Created`

```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "TENANT_USER",
    "tenantId": "tenant-id"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login

```http
POST /api/auth/login
```

Authenticate with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Response:** `200 OK`

```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "TENANT_ADMIN",
    "tenantId": "tenant-id"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Get Profile

```http
GET /api/auth/profile
```

Get the current user's profile. <Badge text="Auth Required" variant="note" />

**Response:** `200 OK`

```json
{
  "id": "cuid123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "TENANT_ADMIN",
  "tenantId": "tenant-id",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

---

## Customers

<Aside>
  All customer endpoints are scoped to the authenticated user's tenant.
</Aside>

### List Customers

```http
GET /api/customers
```

Get paginated list of customers. <Badge text="Auth Required" variant="note" />

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page |
| `search` | string | - | Search by name, email, or phone |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "cuid123",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "leadScore": 50,
      "tags": ["vip", "repeat"],
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Create Customer

```http
POST /api/customers
```

Create a new customer. <Badge text="Auth Required" variant="note" />

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zipCode": "10001",
  "leadSource": "website",
  "tags": ["new"],
  "notes": "Referred by John"
}
```

### Get Customer

```http
GET /api/customers/:id
```

Get customer by ID. <Badge text="Auth Required" variant="note" />

### Update Customer

```http
PUT /api/customers/:id
```

Update customer details. <Badge text="Auth Required" variant="note" />

### Delete Customer

```http
DELETE /api/customers/:id
```

Delete a customer (soft delete). <Badge text="Auth Required" variant="note" />

---

## Vehicles

### List Vehicles

```http
GET /api/vehicles
```

Get paginated list of vehicles. <Badge text="Auth Required" variant="note" />

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number |
| `limit` | integer | Items per page |
| `status` | enum | Filter by status: `AVAILABLE`, `RENTED`, `MAINTENANCE`, `UNAVAILABLE` |
| `category` | string | Filter by category |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "cuid456",
      "make": "Toyota",
      "model": "Camry",
      "year": 2024,
      "licensePlate": "ABC-1234",
      "category": "Sedan",
      "seats": 5,
      "transmission": "Automatic",
      "fuelType": "Petrol",
      "dailyRate": 4500,
      "status": "AVAILABLE",
      "features": ["GPS", "Bluetooth", "Backup Camera"],
      "images": ["https://s3.../image1.jpg"]
    }
  ],
  "meta": { ... }
}
```

### Create Vehicle

```http
POST /api/vehicles
```

Add a new vehicle to the fleet. <Badge text="Auth Required" variant="note" />

**Request Body:**

```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2024,
  "licensePlate": "ABC-1234",
  "vin": "1HGBH41JXMN109186",
  "category": "Sedan",
  "seats": 5,
  "transmission": "Automatic",
  "fuelType": "Petrol",
  "dailyRate": 4500,
  "weeklyRate": 25000,
  "monthlyRate": 80000,
  "features": ["GPS", "Bluetooth"],
  "images": []
}
```

### Update Vehicle Status

```http
PATCH /api/vehicles/:id/status
```

Update vehicle availability status. <Badge text="Auth Required" variant="note" />

**Request Body:**

```json
{
  "status": "MAINTENANCE"
}
```

---

## Bookings

### List Bookings

```http
GET /api/bookings
```

Get paginated list of bookings. <Badge text="Auth Required" variant="note" />

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number |
| `limit` | integer | Items per page |
| `status` | enum | Filter: `PENDING`, `CONFIRMED`, `ACTIVE`, `COMPLETED`, `CANCELLED` |
| `customerId` | string | Filter by customer |
| `vehicleId` | string | Filter by vehicle |

### Create Booking

```http
POST /api/bookings
```

Create a new booking. <Badge text="Auth Required" variant="note" />

**Request Body:**

```json
{
  "customerId": "cuid123",
  "vehicleId": "cuid456",
  "startDate": "2026-02-01T10:00:00.000Z",
  "endDate": "2026-02-05T10:00:00.000Z",
  "addOns": [
    { "name": "GPS", "price": 500 },
    { "name": "Child Seat", "price": 300 }
  ],
  "notes": "Customer prefers early pickup"
}
```

**Response:** `201 Created`

```json
{
  "id": "cuid789",
  "bookingNumber": "BK-2026-0001",
  "customerId": "cuid123",
  "vehicleId": "cuid456",
  "startDate": "2026-02-01T10:00:00.000Z",
  "endDate": "2026-02-05T10:00:00.000Z",
  "status": "PENDING",
  "dailyRate": 4500,
  "totalDays": 4,
  "subtotal": 18000,
  "tax": 3240,
  "total": 22040,
  "addOns": [...]
}
```

### Update Booking Status

```http
PATCH /api/bookings/:id/status
```

Update booking status. <Badge text="Auth Required" variant="note" />

**Request Body:**

```json
{
  "status": "CONFIRMED"
}
```

---

## Tenants (Super Admin)

<Aside type="caution">
  These endpoints are restricted to users with the `SUPER_ADMIN` role.
</Aside>

### List Tenants

```http
GET /api/tenants
```

Get all tenants. <Badge text="Super Admin" variant="caution" />

### Create Tenant

```http
POST /api/tenants
```

Create a new tenant (rental business). <Badge text="Super Admin" variant="caution" />

**Request Body:**

```json
{
  "name": "John's Car Rentals",
  "subdomain": "johnsrentals",
  "plan": "PROFESSIONAL"
}
```

### Get Tenant

```http
GET /api/tenants/:id
```

Get tenant details including subscription. <Badge text="Super Admin" variant="caution" />

---

## Error Codes

| Status Code | Error                 | Description              |
| ----------- | --------------------- | ------------------------ |
| `400`       | Bad Request           | Invalid input data       |
| `401`       | Unauthorized          | Missing or invalid token |
| `403`       | Forbidden             | Insufficient permissions |
| `404`       | Not Found             | Resource not found       |
| `409`       | Conflict              | Resource already exists  |
| `429`       | Too Many Requests     | Rate limit exceeded      |
| `500`       | Internal Server Error | Server error             |

## Rate Limiting

The API implements rate limiting:

- **Window:** 15 minutes
- **Max Requests:** 100 per IP

When rate limit is exceeded:

```json
{
  "error": "Too Many Requests",
  "message": "Too many requests from this IP, please try again later."
}
```

## OpenAPI Specification

The full OpenAPI specification is available at:

- **YAML:** `/api/docs/spec/openapi.yaml`
- **Swagger UI:** `/api/docs`
