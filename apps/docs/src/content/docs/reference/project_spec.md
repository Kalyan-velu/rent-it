---
title: Full Project Specification
description: Master specification document for the Rent-a-Wheel project.
---

# Rent-a-Wheel Project Specification

**Version:** 1.0
**Status:** In Development
**Last Updated:** January 2026

## 1. Executive Summary

**Rent-a-Wheel** is a comprehensive, multi-tenant Car Rental Software (CRS) platform designed to serve three distinct user groups:

1.  **Super Admins**: Platform owners managing subscriptions and tenants.
2.  **Service Admins (Tenants)**: Car rental business owners managing fleets, bookings, and customers.
3.  **Customers**: End-users browsing and booking vehicles.

The system aims to modernize the car rental experience with a premium, responsive web interface, robust fleet management tools, and automated workflows for bookings and payments.

## 2. Technical Stack

- **Frontend**: React, Next.js (Customer Portal), ShadcnUI (Admin Panels), TailwindCSS.
- **Backend**: Node.js, Express (or NestJS), TypeScript.
- **Database**: PostgreSQL with Multi-tenancy support.
- **Infrastructure**: DigitalOcean/Hetzner, Docker, CI/CD pipelines.
- **Documentation**: Astro Starlight.

## 3. Core Feature Areas

### Phase 1: The Working System (Core)

The foundation of the platform, focusing on enabling a rental business to operate manually and customers to book basic rentals.

- **Fleet Management**: CRUD operations for vehicles, detailed descriptions, and image galleries.
- **Booking Engine**: Real-time availability checks, date selection, and reservation creation.
- **Payments**: Stripe integration for deposits, payments, and invoice generation.
- **Dashboards**:
  - _Service Admin_: Calendar view of availability, manual check-in/out, customer CRM.
  - _Customer_: Search inventory, book cars, view booking status.

### Phase 2: Enhanced Operations

Focuses on automation, rule-based logic, and operational efficiency.

- **Advanced Pricing**: Seasonal rates, weekend adjustments, and dynamic pricing rules.
- **Workflow Automation**: Digital check-in/out forms with photo upload for damages.
- **Notifications**: Automated SMS/Email reminders for pickups and returns.
- **Reporting**: Financial reports (Profit/Loss), fleet utilization, and customer analytics.

### Phase 3: Scale & Intelligence

Focuses on scaling, mobile access, and AI-driven optimizations.

- **Mobile Apps**: Native iOS and Android apps for customers.
- **Integration**: Accounting software connectivity (QuickBooks/Xero) and Public API.
- **AI/ML**: Dynamic pricing algorithms and automated ID verification (OCR/Face Match).

## 4. Data Architecture

The database is designed with **Multi-Tenancy** at its core. Every major entity allows for strict data isolation between rental businesses.

### Key Entities

- **Tenants**: Service admin accounts with subscription details.
- **Users**: Unified table for all roles (Super Admin, Service Admin, Staff, Customer).
- **Vehicles**: Detailed inventory with status tracking (Available, Maintenance, Booked).
- **Bookings**: Central reservation records linking Customers, Vehicles, and Payments.
- **Agreements**: Digital contracts and templates.

## 5. Development Roadmap

- **Sprint 0-6**: Infrastructure setup, Auth, Core Admin features.
- **Sprint 7-9**: Customer Portal and Notifications.
- **Sprint 10-11**: Testing, Beta Launch, and Deployment.
- **Sprint 12-19**: Phase 2 features (Pricing, Inspections, Reports).
- **Sprint 20+**: Phase 3 features (Mobile, AI, Integrations).

## 6. Budget & Planning

- **Tracking**: Detailed weekly tracking of Velocity and Story Points.
- **Cost Management**: Monthly operational cost tracking against budget caps.
- **Risk Mitigation**: Proactive identification of technical dependencies (e.g., Payment Gateways, Email Providers).
