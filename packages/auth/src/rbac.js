"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRolePermission = hasRolePermission;
exports.checkAttributeAccess = checkAttributeAccess;
exports.hasAccess = hasAccess;
exports.requireAccess = requireAccess;
/**
 * Hybrid ABAC + RBAC Access Control
 *
 * - RBAC: Role-based permissions (what roles can do)
 * - ABAC: Attribute-based refinement (additional context-based rules)
 */
// Role-based permission matrix
const ROLE_PERMISSIONS = {
    SUPER_ADMIN: [
        // Full access to everything
        { resource: '*', action: '*' },
    ],
    TENANT_ADMIN: [
        // Full access to tenant resources
        { resource: 'customer', action: '*' },
        { resource: 'vehicle', action: '*' },
        { resource: 'booking', action: '*' },
        { resource: 'form', action: '*' },
        { resource: 'website', action: '*' },
        { resource: 'subscription', action: 'read' },
        { resource: 'user', action: '*' },
    ],
    TENANT_USER: [
        // Limited access
        { resource: 'customer', action: 'read' },
        { resource: 'customer', action: 'create' },
        { resource: 'customer', action: 'update' },
        { resource: 'vehicle', action: 'read' },
        { resource: 'booking', action: '*' },
        { resource: 'form', action: 'read' },
    ],
};
/**
 * Check if a role has permission for a resource and action (RBAC)
 */
function hasRolePermission(role, resource, action) {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.some((perm) => {
        const resourceMatch = perm.resource === '*' || perm.resource === resource;
        const actionMatch = perm.action === '*' || perm.action === action;
        return resourceMatch && actionMatch;
    });
}
/**
 * Apply attribute-based access control rules (ABAC)
 *
 * Examples of ABAC rules:
 * - Users can only access resources in their tenant
 * - Users can only edit their own profile
 * - Time-based restrictions (e.g., no bookings after hours)
 */
function checkAttributeAccess(context) {
    const { user, resource, action, attributes = [] } = context;
    // Super admins bypass all ABAC rules
    if (user.role === 'SUPER_ADMIN') {
        return true;
    }
    // Tenant isolation: Users can only access resources in their tenant
    const tenantAttr = attributes.find((attr) => attr.key === 'tenantId');
    if (tenantAttr && tenantAttr.value !== user.tenantId) {
        return false;
    }
    // Ownership: Users can only edit their own user profile
    if (resource === 'user' && action === 'update') {
        const userIdAttr = attributes.find((attr) => attr.key === 'userId');
        if (userIdAttr && userIdAttr.value !== user.id && user.role !== 'TENANT_ADMIN') {
            return false;
        }
    }
    // Add more ABAC rules as needed...
    return true;
}
/**
 * Combined RBAC + ABAC check
 */
function hasAccess(context) {
    // First check RBAC (role-based permissions)
    const hasRbacAccess = hasRolePermission(context.user.role, context.resource, context.action);
    if (!hasRbacAccess) {
        return false;
    }
    // Then refine with ABAC (attribute-based rules)
    return checkAttributeAccess(context);
}
/**
 * Express middleware for access control
 */
function requireAccess(resource, action) {
    return (req, res, next) => {
        const user = req.user; // Assumes user is attached by auth middleware
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const context = {
            user,
            resource,
            action,
            attributes: [
                { key: 'tenantId', value: req.params.tenantId || req.body.tenantId },
            ],
        };
        if (!hasAccess(context)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
}
//# sourceMappingURL=rbac.js.map