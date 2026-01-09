import { eq, and, desc, gte, lte, ilike, or, sql, inArray } from 'drizzle-orm';
import { db } from '../drizzle';
import { events, type NewEvent, type EventStatus } from '../schema/event';
import { users } from '../schema/user';
import { teams } from '../schema/team';
import { team_members } from '../schema/team-member';
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

    findByTeamMembership: async (userId: string) => {
        // Get all team IDs where the user is a member
        const userTeams = await db
            .select({ team_id: team_members.team_id })
            .from(team_members)
            .where(eq(team_members.user_id, userId));

        const teamIds = userTeams.map((t) => t.team_id);

        if (teamIds.length === 0) {
            return [];
        }

        // Get all events belonging to those teams
        return db
            .select({
                event: events,
                team: teams,
            })
            .from(events)
            .innerJoin(teams, eq(events.team_id, teams.id))
            .where(inArray(events.team_id, teamIds))
            .orderBy(desc(events.created_at));
    },

    findByTeamMembershipWithRole: async (userId: string) => {
        // Get events with the user's team role included
        return db
            .select({
                event: events,
                team: teams,
                role: team_members.role,
            })
            .from(events)
            .innerJoin(teams, eq(events.team_id, teams.id))
            .innerJoin(team_members, eq(teams.id, team_members.team_id))
            .where(eq(team_members.user_id, userId))
            .orderBy(desc(events.created_at));
    },

    findAllUserEvents: async (userId: string) => {
        // Get events where user is either the organizer OR a team member
        const userTeams = await db
            .select({ team_id: team_members.team_id })
            .from(team_members)
            .where(eq(team_members.user_id, userId));

        const teamIds = userTeams.map((t) => t.team_id);

        if (teamIds.length === 0) {
            // Only return events where user is the organizer
            return db
                .select()
                .from(events)
                .where(eq(events.organizer_id, userId))
                .orderBy(desc(events.created_at));
        }

        // Return events where user is organizer OR part of the team
        return db
            .select()
            .from(events)
            .where(or(eq(events.organizer_id, userId), inArray(events.team_id, teamIds)))
            .orderBy(desc(events.created_at));
    },

    getEvents: async (params?: {
        search?: string;
        status?: EventStatus;
        limit?: number;
        offset?: number;
    }) => {
        const { search, status, limit = 20, offset = 0 } = params || {};
        const conditions = [];
        if (status) {
            conditions.push(eq(events.status, status));
        }
        if (search) {
            conditions.push(
                or(
                    ilike(events.title, `%${search}%`),
                    ilike(events.description, `%${search}%`),
                    ilike(events.event_type, `%${search}%`),
                    ilike(events.venue_name, `%${search}%`),
                    ilike(events.venue_address, `%${search}%`),
                    ilike(events.city, `%${search}%`),
                    ilike(events.state, `%${search}%`),
                    ilike(events.country, `%${search}%`)
                )
            );
        }

        return db
            .select()
            .from(events)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(events.created_at))
            .limit(limit)
            .offset(offset);
    },
};
