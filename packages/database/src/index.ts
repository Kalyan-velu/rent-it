// Database configuration and Prisma client export
export * from '@prisma/client';
export { PrismaClient } from '@prisma/client';
export { createTenantScopedClient, prisma } from './client';
