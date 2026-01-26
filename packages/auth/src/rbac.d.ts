import { AccessContext, UserRole } from './types';
/**
 * Check if a role has permission for a resource and action (RBAC)
 */
export declare function hasRolePermission(role: UserRole, resource: string, action: string): boolean;
/**
 * Apply attribute-based access control rules (ABAC)
 *
 * Examples of ABAC rules:
 * - Users can only access resources in their tenant
 * - Users can only edit their own profile
 * - Time-based restrictions (e.g., no bookings after hours)
 */
export declare function checkAttributeAccess(context: AccessContext): boolean;
/**
 * Combined RBAC + ABAC check
 */
export declare function hasAccess(context: AccessContext): boolean;
/**
 * Express middleware for access control
 */
export declare function requireAccess(resource: string, action: string): (req: any, res: any, next: any) => any;
//# sourceMappingURL=rbac.d.ts.map