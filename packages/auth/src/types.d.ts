export type UserRole = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'TENANT_USER';
export interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
    tenantId?: string;
}
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId?: string;
}
export interface Permission {
    resource: string;
    action: string;
}
export interface Attribute {
    key: string;
    value: any;
}
export interface AccessContext {
    user: AuthUser;
    resource: string;
    action: string;
    attributes?: Attribute[];
}
//# sourceMappingURL=types.d.ts.map