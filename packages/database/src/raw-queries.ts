import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Raw SQL queries for performance-critical operations
 * Use these when Prisma ORM would cause N+1 queries or performance issues
 */

export const analyticsQueries = {
  /**
   * Get booking analytics with revenue breakdown
   */
  async getBookingAnalytics(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ) {
    return prisma.$queryRaw<
      Array<{
        date: Date;
        total_bookings: bigint;
        total_revenue: number;
        avg_booking_value: number;
      }>
    >`
      SELECT 
        DATE(created_at) as date,
        COUNT(*)::bigint as total_bookings,
        SUM(total)::numeric as total_revenue,
        AVG(total)::numeric as avg_booking_value
      FROM bookings
      WHERE tenant_id = ${tenantId}
        AND created_at >= ${startDate}
        AND created_at <= ${endDate}
        AND deleted_at IS NULL
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
  },

  /**
   * Get top customers by booking count and revenue
   */
  async getTopCustomers(tenantId: string, limit: number = 10) {
    return prisma.$queryRaw<
      Array<{
        customer_id: string;
        customer_name: string;
        customer_email: string;
        booking_count: bigint;
        total_spent: number;
      }>
    >`
      SELECT 
        c.id as customer_id,
        c.name as customer_name,
        c.email as customer_email,
        COUNT(b.id)::bigint as booking_count,
        COALESCE(SUM(b.total), 0)::numeric as total_spent
      FROM customers c
      LEFT JOIN bookings b ON b.customer_id = c.id
      WHERE c.tenant_id = ${tenantId}
        AND c.deleted_at IS NULL
      GROUP BY c.id, c.name, c.email
      ORDER BY total_spent DESC
      LIMIT ${limit}
    `;
  },

  /**
   * Get vehicle utilization report
   */
  async getVehicleUtilization(tenantId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.$queryRaw<
      Array<{
        vehicle_id: string;
        vehicle_name: string;
        total_days: number;
        booked_days: bigint;
        utilization_rate: number;
      }>
    >`
      SELECT 
        v.id as vehicle_id,
        CONCAT(v.make, ' ', v.model) as vehicle_name,
        ${days}::numeric as total_days,
        COALESCE(COUNT(DISTINCT DATE(b.start_date)), 0)::bigint as booked_days,
        (COALESCE(COUNT(DISTINCT DATE(b.start_date)), 0)::numeric / ${days}::numeric * 100) as utilization_rate
      FROM vehicles v
      LEFT JOIN bookings b ON b.vehicle_id = v.id 
        AND b.start_date >= ${startDate}
        AND b.status IN ('CONFIRMED', 'ACTIVE', 'COMPLETED')
      WHERE v.tenant_id = ${tenantId}
        AND v.deleted_at IS NULL
      GROUP BY v.id, v.make, v.model
      ORDER BY utilization_rate DESC
    `;
  },
};

/**
 * Safe parameterized query builder
 * Use Prisma.sql template literal to prevent SQL injection
 */
export function buildDynamicQuery(
  baseQuery: string,
  params: Record<string, any>
) {
  // This is a helper - always use Prisma.sql in actual implementation
  return Prisma.sql([baseQuery], ...Object.values(params));
}
