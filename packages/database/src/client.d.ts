import { PrismaClient } from '@prisma/client';
declare global {
    var prisma: PrismaClient | undefined;
}
export declare const prisma: any;
export declare function createTenantScopedClient(tenantId: string): any;
export default prisma;
//# sourceMappingURL=client.d.ts.map