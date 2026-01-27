import { z } from 'zod';

/**
 * Tenant validation schemas
 */
export const createTenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  subdomain: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      'Subdomain must be lowercase alphanumeric with hyphens'
    ),
  logoUrl: z.string().url().optional(),
  customDomain: z.string().optional(),
  plan: z.enum(['BASIC', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
});

export const updateTenantSchema = createTenantSchema
  .omit({ plan: true })
  .partial();

export const updateSubscriptionSchema = z.object({
  plan: z.enum(['BASIC', 'PROFESSIONAL', 'ENTERPRISE']),
  status: z.enum(['ACTIVE', 'TRIALING', 'CANCELED', 'PAST_DUE']).optional(),
});

export type CreateTenantDto = z.infer<typeof createTenantSchema>;
export type UpdateTenantDto = z.infer<typeof updateTenantSchema>;
export type UpdateSubscriptionDto = z.infer<typeof updateSubscriptionSchema>;
