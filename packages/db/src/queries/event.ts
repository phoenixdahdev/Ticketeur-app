import { eq, and, desc, gte, lte, ilike, or, sql } from 'drizzle-orm';
import { db } from '../drizzle';
import { events, type NewEvent, type EventStatus } from '../schema/event';
import { users } from '../schema/user';
import { teams } from '../schema/team';
import { ticket_types } from '../schema/ticket-type';

export const eventQueries = {
    create: async (data: NewEvent) => {
        const [event] = await db.insert(events).values(data).returning();
        return event;
    },

    findById: async (id: string) => {
        const [event] = await db.select().from(events).where(eq(events.id, id));
        return event;
    },

    findByIdWithOrganizer: async (id: string) => {
        const [result] = await db
            .select({
                event: events,
                organizer: users,
                team: teams,
            })
            .from(events)
            .innerJoin(users, eq(events.organizer_id, users.id))
            .leftJoin(teams, eq(events.team_id, teams.id))
            .where(eq(events.id, id));
        return result;
    },

    findByOrganizerId: async (organizerId: string) => {
        return db
            .select()
            .from(events)
            .where(eq(events.organizer_id, organizerId))
            .orderBy(desc(events.created_at));
    },

    findByTeamId: async (teamId: string) => {
        return db.select().from(events).where(eq(events.team_id, teamId)).orderBy(desc(events.created_at));
    },

    findPublished: async (limit = 20, offset = 0) => {
        return db
            .select()
            .from(events)
            .where(eq(events.status, 'published'))
            .orderBy(desc(events.start_date))
            .limit(limit)
            .offset(offset);
    },

    findUpcoming: async (limit = 20) => {
        return db
            .select()
            .from(events)
            .where(and(eq(events.status, 'published'), gte(events.start_date, new Date())))
            .orderBy(events.start_date)
            .limit(limit);
    },

    findFeatured: async (limit = 10) => {
        return db
            .select()
            .from(events)
            .where(and(eq(events.status, 'published'), eq(events.is_featured, true)))
            .orderBy(desc(events.created_at))
            .limit(limit);
    },

    findPendingApproval: async () => {
        return db
            .select({
                event: events,
                organizer: users,
            })
            .from(events)
            .innerJoin(users, eq(events.organizer_id, users.id))
            .where(eq(events.status, 'pending_approval'))
            .orderBy(desc(events.created_at));
    },

    update: async (id: string, data: Partial<NewEvent>) => {
        const [updated] = await db
            .update(events)
            .set({ ...data, updated_at: new Date() })
            .where(eq(events.id, id))
            .returning();
        return updated;
    },

    updateStatus: async (id: string, status: EventStatus) => {
        return eventQueries.update(id, { status });
    },

    submitForApproval: async (id: string) => {
        return eventQueries.updateStatus(id, 'pending_approval');
    },

    approve: async (id: string) => {
        return eventQueries.updateStatus(id, 'approved');
    },

    reject: async (id: string) => {
        return eventQueries.updateStatus(id, 'rejected');
    },

    publish: async (id: string) => {
        return eventQueries.updateStatus(id, 'published');
    },

    cancel: async (id: string) => {
        return eventQueries.updateStatus(id, 'cancelled');
    },

    complete: async (id: string) => {
        return eventQueries.updateStatus(id, 'completed');
    },

    delete: async (id: string) => {
        const [deleted] = await db.delete(events).where(eq(events.id, id)).returning();
        return deleted;
    },

    search: async (query: string, limit = 20) => {
        return db
            .select()
            .from(events)
            .where(
                and(
                    eq(events.status, 'published'),
                    or(ilike(events.title, `%${query}%`), ilike(events.description, `%${query}%`))
                )
            )
            .orderBy(desc(events.start_date))
            .limit(limit);
    },

    findByDateRange: async (startDate: Date, endDate: Date) => {
        return db
            .select()
            .from(events)
            .where(
                and(
                    eq(events.status, 'published'),
                    gte(events.start_date, startDate),
                    lte(events.start_date, endDate)
                )
            )
            .orderBy(events.start_date);
    },

    getWithTicketTypes: async (id: string) => {
        const event = await eventQueries.findById(id);
        if (!event) return null;

        const ticketTypesList = await db
            .select()
            .from(ticket_types)
            .where(eq(ticket_types.event_id, id))
            .orderBy(ticket_types.price);

        return { event, ticketTypes: ticketTypesList };
    },

    countByStatus: async () => {
        const result = await db
            .select({
                status: events.status,
                count: sql<number>`count(*)::int`,
            })
            .from(events)
            .groupBy(events.status);
        return result;
    },
};
