import { PrismaClient } from '@prisma/client';

// Singleton Prisma client instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Tenant-scoped middleware
export function createTenantScopedClient(tenantId: string) {
  return prisma.$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        // Models that should be tenant-scoped
        const tenantModels = [
          'Customer',
          'Vehicle',
          'Booking',
          'Form',
          'FormSubmission',
        ];

        if (model && tenantModels.includes(model)) {
          // Add tenantId to where clause for reads
          if (
            [
              'findMany',
              'findFirst',
              'findUnique',
              'count',
              'aggregate',
            ].includes(operation)
          ) {
            args.where = { ...args.where, tenantId };
          }

          // Add tenantId to data for creates
          if (operation === 'create') {
            args.data = { ...args.data, tenantId };
          }

          // Ensure updates/deletes are scoped to tenant
          if (
            ['update', 'updateMany', 'delete', 'deleteMany'].includes(operation)
          ) {
            args.where = { ...args.where, tenantId };
          }
        }

        return query(args);
      },
    },
  });
}

export default prisma;
