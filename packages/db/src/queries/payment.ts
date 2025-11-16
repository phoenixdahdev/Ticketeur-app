import { eq, and, desc, sql, gte, lte } from 'drizzle-orm';
import { db } from '../drizzle';
import { payments, type NewPayment, type PaymentStatus } from '../schema/payment';
import { users } from '../schema/user';
import { tickets } from '../schema/ticket';

export const paymentQueries = {
    create: async (data: NewPayment) => {
        const [payment] = await db.insert(payments).values(data).returning();
        return payment;
    },

    findById: async (id: string) => {
        const [payment] = await db.select().from(payments).where(eq(payments.id, id));
        return payment;
    },

    findByTransactionReference: async (reference: string) => {
        const [payment] = await db
            .select()
            .from(payments)
            .where(eq(payments.transaction_reference, reference));
        return payment;
    },

    findByIdWithDetails: async (id: string) => {
        const [result] = await db
            .select({
                payment: payments,
                user: users,
                ticket: tickets,
            })
            .from(payments)
            .innerJoin(users, eq(payments.user_id, users.id))
            .leftJoin(tickets, eq(payments.ticket_id, tickets.id))
            .where(eq(payments.id, id));
        return result;
    },

    findByUserId: async (userId: string) => {
        return db
            .select()
            .from(payments)
            .where(eq(payments.user_id, userId))
            .orderBy(desc(payments.created_at));
    },

    findByTicketId: async (ticketId: string) => {
        const [payment] = await db.select().from(payments).where(eq(payments.ticket_id, ticketId));
        return payment;
    },

    update: async (id: string, data: Partial<NewPayment>) => {
        const [updated] = await db
            .update(payments)
            .set({ ...data, updated_at: new Date() })
            .where(eq(payments.id, id))
            .returning();
        return updated;
    },

    updateStatus: async (id: string, status: PaymentStatus) => {
        return paymentQueries.update(id, { status });
    },

    markAsProcessing: async (id: string) => {
        return paymentQueries.updateStatus(id, 'processing');
    },

    markAsSuccessful: async (id: string, providerResponse?: Record<string, unknown>) => {
        const [updated] = await db
            .update(payments)
            .set({
                status: 'successful',
                provider_response: providerResponse,
                paid_at: new Date(),
                updated_at: new Date(),
            })
            .where(eq(payments.id, id))
            .returning();
        return updated;
    },

    markAsFailed: async (id: string, reason: string, providerResponse?: Record<string, unknown>) => {
        const [updated] = await db
            .update(payments)
            .set({
                status: 'failed',
                failure_reason: reason,
                provider_response: providerResponse,
                updated_at: new Date(),
            })
            .where(eq(payments.id, id))
            .returning();
        return updated;
    },

    markAsRefunded: async (id: string) => {
        return paymentQueries.updateStatus(id, 'refunded');
    },

    delete: async (id: string) => {
        const [deleted] = await db.delete(payments).where(eq(payments.id, id)).returning();
        return deleted;
    },

    findByStatus: async (status: PaymentStatus) => {
        return db.select().from(payments).where(eq(payments.status, status)).orderBy(desc(payments.created_at));
    },

    findByDateRange: async (startDate: Date, endDate: Date) => {
        return db
            .select()
            .from(payments)
            .where(and(gte(payments.created_at, startDate), lte(payments.created_at, endDate)))
            .orderBy(desc(payments.created_at));
    },

    getTotalRevenue: async () => {
        const [result] = await db
            .select({
                total: sql<string>`sum(${payments.net_amount})`,
                count: sql<number>`count(*)::int`,
            })
            .from(payments)
            .where(eq(payments.status, 'successful'));
        return result;
    },

    getRevenueByDateRange: async (startDate: Date, endDate: Date) => {
        const [result] = await db
            .select({
                total: sql<string>`sum(${payments.net_amount})`,
                count: sql<number>`count(*)::int`,
                fees: sql<string>`sum(${payments.fee})`,
            })
            .from(payments)
            .where(
                and(
                    eq(payments.status, 'successful'),
                    gte(payments.paid_at, startDate),
                    lte(payments.paid_at, endDate)
                )
            );
        return result;
    },

    generateTransactionReference: () => {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 10).toUpperCase();
        return `TXN-${timestamp}-${random}`;
    },
};
