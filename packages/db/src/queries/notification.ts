import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../drizzle';
import { notifications, type NewNotification } from '../schema/notification';

export const notificationQueries = {
    create: async (data: NewNotification) => {
        const [notification] = await db.insert(notifications).values(data).returning();
        return notification;
    },

    createMany: async (data: NewNotification[]) => {
        return db.insert(notifications).values(data).returning();
    },

    findById: async (id: string) => {
        const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
        return notification;
    },

    findByUserId: async (userId: string, limit = 50) => {
        return db
            .select()
            .from(notifications)
            .where(eq(notifications.user_id, userId))
            .orderBy(desc(notifications.created_at))
            .limit(limit);
    },

    findUnreadByUserId: async (userId: string) => {
        return db
            .select()
            .from(notifications)
            .where(and(eq(notifications.user_id, userId), eq(notifications.is_read, false)))
            .orderBy(desc(notifications.created_at));
    },

    markAsRead: async (id: string) => {
        const [updated] = await db
            .update(notifications)
            .set({
                is_read: true,
                read_at: new Date(),
            })
            .where(eq(notifications.id, id))
            .returning();
        return updated;
    },

    markAllAsRead: async (userId: string) => {
        return db
            .update(notifications)
            .set({
                is_read: true,
                read_at: new Date(),
            })
            .where(and(eq(notifications.user_id, userId), eq(notifications.is_read, false)))
            .returning();
    },

    delete: async (id: string) => {
        const [deleted] = await db.delete(notifications).where(eq(notifications.id, id)).returning();
        return deleted;
    },

    deleteAllByUserId: async (userId: string) => {
        return db.delete(notifications).where(eq(notifications.user_id, userId)).returning();
    },

    countUnread: async (userId: string) => {
        const [result] = await db
            .select({
                count: sql<number>`count(*)::int`,
            })
            .from(notifications)
            .where(and(eq(notifications.user_id, userId), eq(notifications.is_read, false)));
        return result?.count ?? 0;
    },

    deleteOld: async (daysOld: number = 30) => {
        const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
        return db
            .delete(notifications)
            .where(sql`${notifications.created_at} < ${cutoff}`)
            .returning();
    },
};
