import { eq, asc } from 'drizzle-orm';
import { db } from '../drizzle';
import { event_sessions, type NewEventSession } from '../schema/event-session';
import { speakers } from '../schema/speaker';

export const eventSessionQueries = {
    create: async (data: NewEventSession) => {
        const [session] = await db.insert(event_sessions).values(data).returning();
        return session;
    },

    createMany: async (data: NewEventSession[]) => {
        return db.insert(event_sessions).values(data).returning();
    },

    findById: async (id: string) => {
        const [session] = await db.select().from(event_sessions).where(eq(event_sessions.id, id));
        return session;
    },

    findByEventId: async (eventId: string) => {
        return db
            .select()
            .from(event_sessions)
            .where(eq(event_sessions.event_id, eventId))
            .orderBy(asc(event_sessions.order), asc(event_sessions.start_time));
    },

    findByIdWithSpeakers: async (id: string) => {
        const session = await eventSessionQueries.findById(id);
        if (!session) return null;

        const sessionSpeakers = await db
            .select()
            .from(speakers)
            .where(eq(speakers.session_id, id))
            .orderBy(asc(speakers.order));

        return { session, speakers: sessionSpeakers };
    },

    findByEventIdWithSpeakers: async (eventId: string) => {
        const sessions = await eventSessionQueries.findByEventId(eventId);

        const sessionsWithSpeakers = await Promise.all(
            sessions.map(async (session) => {
                const sessionSpeakers = await db
                    .select()
                    .from(speakers)
                    .where(eq(speakers.session_id, session.id))
                    .orderBy(asc(speakers.order));
                return { session, speakers: sessionSpeakers };
            })
        );

        return sessionsWithSpeakers;
    },

    update: async (id: string, data: Partial<NewEventSession>) => {
        const [updated] = await db
            .update(event_sessions)
            .set({ ...data, updated_at: new Date() })
            .where(eq(event_sessions.id, id))
            .returning();
        return updated;
    },

    delete: async (id: string) => {
        const [deleted] = await db.delete(event_sessions).where(eq(event_sessions.id, id)).returning();
        return deleted;
    },

    deleteByEventId: async (eventId: string) => {
        return db.delete(event_sessions).where(eq(event_sessions.event_id, eventId)).returning();
    },

    reorder: async (sessionIds: string[]) => {
        const updates = sessionIds.map((id, index) =>
            db
                .update(event_sessions)
                .set({ order: index, updated_at: new Date() })
                .where(eq(event_sessions.id, id))
        );
        await Promise.all(updates);
    },

    countByEventId: async (eventId: string) => {
        const sessionList = await db
            .select()
            .from(event_sessions)
            .where(eq(event_sessions.event_id, eventId));
        return sessionList.length;
    },
};
