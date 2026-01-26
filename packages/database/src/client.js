"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.createTenantScopedClient = createTenantScopedClient;
const client_1 = require("@prisma/client");
exports.prisma = global.prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    global.prisma = exports.prisma;
}
// Tenant-scoped middleware
function createTenantScopedClient(tenantId) {
    return exports.prisma.$extends({
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
                    if ([
                        'findMany',
                        'findFirst',
                        'findUnique',
                        'count',
                        'aggregate',
                    ].includes(operation)) {
                        args.where = { ...args.where, tenantId };
                    }
                    // Add tenantId to data for creates
                    if (operation === 'create') {
                        args.data = { ...args.data, tenantId };
                    }
                    // Ensure updates/deletes are scoped to tenant
                    if (['update', 'updateMany', 'delete', 'deleteMany'].includes(operation)) {
                        args.where = { ...args.where, tenantId };
                    }
                }
                return query(args);
            },
        },
    });
}
exports.default = exports.prisma;
//# sourceMappingURL=client.js.map