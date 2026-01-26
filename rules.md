# Rent-a-Wheel Project Rules

This document outlines the development, security, and architectural rules for the Rent-a-Wheel project. All contributors and AI agents must adhere to these rules.

## 🏗 Architecture & Stack
- **Monorepo**: Turborepo managed. Do not break the workspace structure.
- **Backend**: Express.js with TypeScript (`apps/api`).
- **CRM Frontend**: Next.js 14+ App Router (`apps/crm`).
- **Admin Dashboard**: React + Vite (`apps/admin`).
- **Database**: PostgreSQL with Prisma ORM (`packages/database`).
- **Auth**: Hybrid RBAC + ABAC (`packages/auth`).

## 🛠 Development Guidelines
- **Package Manager**: Use `pnpm`. Never use `npm` or `yarn`.
- **TypeScript**: Strictly follow TypeScript. Avoid using `any` at all costs.
- **Validation**: Use **Zod** for all schema validations (API requests, environment variables, form data).
- **Tenant Isolation**: This is a multi-tenant platform. Every database query must filter by `tenantId`.
- **Shared Logic**: Logic used by multiple apps must reside in `packages/*`.

## 📝 Code Style
- Follow the existing ESLint and Prettier configurations.
- Use functional components and hooks for React/Next.js.
- Keep components small and reusable; place common components in `packages/ui`.
- Maintain clear and concise KDoc/comments for complex logic.

## 🔐 Security Rules
- **Access Control**: Always check permissions using the RBAC/ABAC system in `@rent-a-wheel/auth`.
- **Data Protection**: Never expose sensitive data (passwords, internal IDs) in API responses.
- **Input Sanitization**: Use `isomorphic-dompurify` for any user-generated content.
- **Secrets**: Never commit `.env` files or hardcoded secrets. Use AWS Secrets Manager or similar in production.

## 🧪 Testing & Quality
- **Unit Tests**: Mandatory for all business logic and utility functions.
- **Integration Tests**: Required for critical API endpoints.
- **Type Checking**: Run `pnpm check-types` before any major change.
- **Linting**: Ensure `pnpm lint` passes.

## 🤖 AI Agent Guidelines
- Be concise and focus on providing high-quality code.
- When modifying the database, update the Prisma schema first and run `pnpm db:generate`.
- Respect tenant isolation at all times.
- If a task is ambiguous regarding multi-tenancy, always ask for clarification.
