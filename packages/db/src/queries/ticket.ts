import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../drizzle';
import { tickets, type NewTicket, type TicketStatus } from '../schema/ticket';
import { events } from '../schema/event';
import { ticket_types } from '../schema/ticket-type';
import { users } from '../schema/user';

export const ticketQueries = {
    create: async (data: NewTicket) => {
        const [ticket] = await db.insert(tickets).values(data).returning();
        return ticket;
    },

    createMany: async (data: NewTicket[]) => {
        return db.insert(tickets).values(data).returning();
    },

    findById: async (id: string) => {
        const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
        return ticket;
    },

    findByTicketNumber: async (ticketNumber: string) => {
        const [ticket] = await db.select().from(tickets).where(eq(tickets.ticket_number, ticketNumber));
        return ticket;
    },

    findByQRCode: async (qrCode: string) => {
        const [ticket] = await db.select().from(tickets).where(eq(tickets.qr_code, qrCode));
        return ticket;
    },

    findByIdWithDetails: async (id: string) => {
        const [result] = await db
            .select({
                ticket: tickets,
                event: events,
                ticketType: ticket_types,
                user: users,
            })
            .from(tickets)
            .innerJoin(events, eq(tickets.event_id, events.id))
            .innerJoin(ticket_types, eq(tickets.ticket_type_id, ticket_types.id))
            .innerJoin(users, eq(tickets.user_id, users.id))
            .where(eq(tickets.id, id));
        return result;
    },

    findByUserId: async (userId: string) => {
        return db
            .select({
                ticket: tickets,
                event: events,
                ticketType: ticket_types,
            })
            .from(tickets)
            .innerJoin(events, eq(tickets.event_id, events.id))
            .innerJoin(ticket_types, eq(tickets.ticket_type_id, ticket_types.id))
            .where(eq(tickets.user_id, userId))
            .orderBy(desc(tickets.created_at));
    },

    findByEventId: async (eventId: string) => {
        return db
            .select({
                ticket: tickets,
                ticketType: ticket_types,
                user: users,
            })
            .from(tickets)
            .innerJoin(ticket_types, eq(tickets.ticket_type_id, ticket_types.id))
            .innerJoin(users, eq(tickets.user_id, users.id))
            .where(eq(tickets.event_id, eventId))
            .orderBy(desc(tickets.created_at));
    },

    update: async (id: string, data: Partial<NewTicket>) => {
        const [updated] = await db
            .update(tickets)
            .set({ ...data, updated_at: new Date() })
            .where(eq(tickets.id, id))
            .returning();
        return updated;
    },

    updateStatus: async (id: string, status: TicketStatus) => {
        return ticketQueries.update(id, { status });
    },

    markAsPaid: async (id: string, paymentId: string) => {
        return ticketQueries.update(id, { status: 'paid', payment_id: paymentId });
    },

    checkIn: async (id: string) => {
        const [updated] = await db
            .update(tickets)
            .set({
                status: 'used',
                checked_in_at: new Date(),
                updated_at: new Date(),
            })
            .where(eq(tickets.id, id))
            .returning();
        return updated;
    },

    cancel: async (id: string) => {
        return ticketQueries.updateStatus(id, 'cancelled');
    },

    refund: async (id: string) => {
        return ticketQueries.updateStatus(id, 'refunded');
    },

    delete: async (id: string) => {
        const [deleted] = await db.delete(tickets).where(eq(tickets.id, id)).returning();
        return deleted;
    },

    countByEventId: async (eventId: string) => {
        const [result] = await db
            .select({
                total: sql<number>`count(*)::int`,
                paid: sql<number>`count(*) filter (where ${tickets.status} = 'paid')::int`,
                used: sql<number>`count(*) filter (where ${tickets.status} = 'used')::int`,
                cancelled: sql<number>`count(*) filter (where ${tickets.status} = 'cancelled')::int`,
            })
            .from(tickets)
            .where(eq(tickets.event_id, eventId));
        return result;
    },

    findExpiredReservations: async (minutes: number = 15) => {
        const cutoff = new Date(Date.now() - minutes * 60 * 1000);
        return db
            .select()
            .from(tickets)
            .where(and(eq(tickets.status, 'reserved'), sql`${tickets.created_at} < ${cutoff}`));
    },

    cancelExpiredReservations: async (minutes: number = 15) => {
        const cutoff = new Date(Date.now() - minutes * 60 * 1000);
        return db
            .update(tickets)
            .set({ status: 'cancelled', updated_at: new Date() })
            .where(and(eq(tickets.status, 'reserved'), sql`${tickets.created_at} < ${cutoff}`))
            .returning();
    },

    generateTicketNumber: () => {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TKT-${timestamp}-${random}`;
    },

    generateQRCode: () => {
        const uuid = crypto.randomUUID();
        return `QR-${uuid}`;
    },
};
