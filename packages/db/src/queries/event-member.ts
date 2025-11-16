import { eq, and, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { event_members, type NewEventMember, type EventMemberRole } from '../schema/event-member';
import { users } from '../schema/user';
import { events } from '../schema/event';

export const eventMemberQueries = {
    create: async (data: NewEventMember) => {
        const [member] = await db.insert(event_members).values(data).returning();
        return member;
    },

    createMany: async (data: NewEventMember[]) => {
        return db.insert(event_members).values(data).returning();
    },

    findById: async (id: string) => {
        const [member] = await db.select().from(event_members).where(eq(event_members.id, id));
        return member;
    },

    findByEventId: async (eventId: string) => {
        return db
            .select({
                member: event_members,
                user: users,
            })
            .from(event_members)
            .innerJoin(users, eq(event_members.user_id, users.id))
            .where(eq(event_members.event_id, eventId))
            .orderBy(event_members.role, desc(event_members.added_at));
    },

    findByUserId: async (userId: string) => {
        return db
            .select({
                member: event_members,
                event: events,
            })
            .from(event_members)
            .innerJoin(events, eq(event_members.event_id, events.id))
            .where(eq(event_members.user_id, userId))
            .orderBy(desc(event_members.added_at));
    },

    findByEventAndUser: async (eventId: string, userId: string) => {
        const [member] = await db
            .select()
            .from(event_members)
            .where(and(eq(event_members.event_id, eventId), eq(event_members.user_id, userId)));
        return member;
    },

    update: async (id: string, data: Partial<NewEventMember>) => {
        const [updated] = await db
            .update(event_members)
            .set({ ...data, updated_at: new Date() })
            .where(eq(event_members.id, id))
            .returning();
        return updated;
    },

    updateRole: async (id: string, role: EventMemberRole) => {
        return eventMemberQueries.update(id, { role });
    },

    remove: async (eventId: string, userId: string) => {
        const [deleted] = await db
            .delete(event_members)
            .where(and(eq(event_members.event_id, eventId), eq(event_members.user_id, userId)))
            .returning();
        return deleted;
    },

    delete: async (id: string) => {
        const [deleted] = await db.delete(event_members).where(eq(event_members.id, id)).returning();
        return deleted;
    },

    isEventMember: async (eventId: string, userId: string) => {
        const member = await eventMemberQueries.findByEventAndUser(eventId, userId);
        return !!member;
    },

    isEventOrganizer: async (eventId: string, userId: string) => {
        const member = await eventMemberQueries.findByEventAndUser(eventId, userId);
        return member && member.role === 'organizer';
    },

    countByEventId: async (eventId: string) => {
        const members = await db
            .select()
            .from(event_members)
            .where(eq(event_members.event_id, eventId));
        return members.length;
    },
};
