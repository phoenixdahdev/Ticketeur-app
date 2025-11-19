import { eq, and, sql, gte, lte } from 'drizzle-orm';
import { db } from '../drizzle';
import { ticket_types, type NewTicketType } from '../schema/ticket-type';

export const ticketTypeQueries = {
    create: async (data: NewTicketType) => {
        const [ticketType] = await db.insert(ticket_types).values(data).returning();
        return ticketType;
    },

    createMany: async (data: NewTicketType[]) => {
        return db.insert(ticket_types).values(data).returning();
    },

    findById: async (id: string) => {
        const [ticketType] = await db.select().from(ticket_types).where(eq(ticket_types.id, id));
        return ticketType;
    },

    findByEventId: async (eventId: string) => {
        return db.select().from(ticket_types).where(eq(ticket_types.event_id, eventId)).orderBy(ticket_types.price);
    },

    findAvailableByEventId: async (eventId: string) => {
        const now = new Date();
        return db
            .select()
            .from(ticket_types)
            .where(
                and(
                    eq(ticket_types.event_id, eventId),
                    eq(ticket_types.is_active, true),
                    sql`${ticket_types.quantity_sold} < ${ticket_types.quantity_available}`,
                    lte(ticket_types.sales_start, now),
                    gte(ticket_types.sales_end, now)
                )
            )
            .orderBy(ticket_types.price);
    },

    update: async (id: string, data: Partial<NewTicketType>) => {
        const [updated] = await db
            .update(ticket_types)
            .set({ ...data, updated_at: new Date() })
            .where(eq(ticket_types.id, id))
            .returning();
        return updated;
    },

    incrementSold: async (id: string, quantity: number = 1) => {
        const [updated] = await db
            .update(ticket_types)
            .set({
                quantity_sold: sql`${ticket_types.quantity_sold} + ${quantity}`,
                updated_at: new Date(),
            })
            .where(eq(ticket_types.id, id))
            .returning();
        return updated;
    },

    decrementSold: async (id: string, quantity: number = 1) => {
        const [updated] = await db
            .update(ticket_types)
            .set({
                quantity_sold: sql`${ticket_types.quantity_sold} - ${quantity}`,
                updated_at: new Date(),
            })
            .where(eq(ticket_types.id, id))
            .returning();
        return updated;
    },

    delete: async (id: string) => {
        const [deleted] = await db.delete(ticket_types).where(eq(ticket_types.id, id)).returning();
        return deleted;
    },

    getAvailableQuantity: async (id: string) => {
        const ticketType = await ticketTypeQueries.findById(id);
        if (!ticketType) return 0;
        return ticketType.quantity_available - ticketType.quantity_sold;
    },

    isAvailable: async (id: string, quantity: number = 1) => {
        const available = await ticketTypeQueries.getAvailableQuantity(id);
        return available >= quantity;
    },
};
