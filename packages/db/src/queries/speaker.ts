import { eq, asc, isNull, and } from 'drizzle-orm';
import { db } from '../drizzle';
import { speakers, type NewSpeaker } from '../schema/speaker';
import { event_sessions } from '../schema/event-session';

export const speakerQueries = {
    create: async (data: NewSpeaker) => {
        const [speaker] = await db.insert(speakers).values(data).returning();
        return speaker;
    },

    createMany: async (data: NewSpeaker[]) => {
        return db.insert(speakers).values(data).returning();
    },

    findById: async (id: string) => {
        const [speaker] = await db.select().from(speakers).where(eq(speakers.id, id));
        return speaker;
    },

    findByIdWithSession: async (id: string) => {
        const [result] = await db
            .select({
                speaker: speakers,
                session: event_sessions,
            })
            .from(speakers)
            .leftJoin(event_sessions, eq(speakers.session_id, event_sessions.id))
            .where(eq(speakers.id, id));
        return result;
    },

    findByEventId: async (eventId: string) => {
        return db
            .select()
            .from(speakers)
            .where(eq(speakers.event_id, eventId))
            .orderBy(asc(speakers.order), asc(speakers.session_time));
    },

    findByEventIdWithSessions: async (eventId: string) => {
        return db
            .select({
                speaker: speakers,
                session: event_sessions,
            })
            .from(speakers)
            .leftJoin(event_sessions, eq(speakers.session_id, event_sessions.id))
            .where(eq(speakers.event_id, eventId))
            .orderBy(asc(speakers.order), asc(speakers.session_time));
    },

    findBySessionId: async (sessionId: string) => {
        return db
            .select()
            .from(speakers)
            .where(eq(speakers.session_id, sessionId))
            .orderBy(asc(speakers.order));
    },

    findUnassignedByEventId: async (eventId: string) => {
        return db
            .select()
            .from(speakers)
            .where(and(eq(speakers.event_id, eventId), isNull(speakers.session_id)))
            .orderBy(asc(speakers.order));
    },

    assignToSession: async (speakerId: string, sessionId: string) => {
        const [updated] = await db
            .update(speakers)
            .set({ session_id: sessionId, updated_at: new Date() })
            .where(eq(speakers.id, speakerId))
            .returning();
        return updated;
    },

    unassignFromSession: async (speakerId: string) => {
        const [updated] = await db
            .update(speakers)
            .set({ session_id: null, updated_at: new Date() })
            .where(eq(speakers.id, speakerId))
            .returning();
        return updated;
    },

    update: async (id: string, data: Partial<NewSpeaker>) => {
        const [updated] = await db
            .update(speakers)
            .set({ ...data, updated_at: new Date() })
            .where(eq(speakers.id, id))
            .returning();
        return updated;
    },

    delete: async (id: string) => {
        const [deleted] = await db.delete(speakers).where(eq(speakers.id, id)).returning();
        return deleted;
    },

    deleteByEventId: async (eventId: string) => {
        return db.delete(speakers).where(eq(speakers.event_id, eventId)).returning();
    },

    reorder: async (speakerIds: string[]) => {
        const updates = speakerIds.map((id, index) =>
            db
                .update(speakers)
                .set({ order: index, updated_at: new Date() })
                .where(eq(speakers.id, id))
        );
        await Promise.all(updates);
    },

    countByEventId: async (eventId: string) => {
        const speakerList = await db
            .select()
            .from(speakers)
            .where(eq(speakers.event_id, eventId));
        return speakerList.length;
    },

    countBySessionId: async (sessionId: string) => {
        const speakerList = await db
            .select()
            .from(speakers)
            .where(eq(speakers.session_id, sessionId));
        return speakerList.length;
    },
};
