import { config } from 'dotenv';
import path from "node:path";
config({path: [path.resolve(__dirname, '../.env'), path.resolve(__dirname, '../../.env')]})

// Database configuration and Prisma client export

export * from './generated/prisma';
export { PrismaClient } from './generated/prisma';
export { createTenantScopedClient, prisma } from './client';
