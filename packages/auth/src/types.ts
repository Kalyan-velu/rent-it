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

// ABAC & RBAC Types
export interface Permission {
  resource: string; // e.g., "customer", "vehicle", "booking"
  action: string;   // e.g., "create", "read", "update", "delete"
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
