import { eq, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { event_approvals, type NewEventApproval, type EventApprovalType } from '../schema/event-approval';
import { events } from '../schema/event';
import { users } from '../schema/user';

export const eventApprovalQueries = {
    create: async (data: NewEventApproval) => {
        const [approval] = await db.insert(event_approvals).values(data).returning();
        return approval;
    },

    findById: async (id: string) => {
        const [approval] = await db.select().from(event_approvals).where(eq(event_approvals.id, id));
        return approval;
    },

    findByEventId: async (eventId: string) => {
        return db
            .select({
                approval: event_approvals,
                admin: users,
            })
            .from(event_approvals)
            .leftJoin(users, eq(event_approvals.admin_id, users.id))
            .where(eq(event_approvals.event_id, eventId))
            .orderBy(desc(event_approvals.created_at));
    },

    findLatestByEventId: async (eventId: string) => {
        const [approval] = await db
            .select()
            .from(event_approvals)
            .where(eq(event_approvals.event_id, eventId))
            .orderBy(desc(event_approvals.created_at))
            .limit(1);
        return approval;
    },

    findPending: async () => {
        return db
            .select({
                approval: event_approvals,
                event: events,
            })
            .from(event_approvals)
            .innerJoin(events, eq(event_approvals.event_id, events.id))
            .where(eq(event_approvals.type, 'pending'))
            .orderBy(desc(event_approvals.created_at));
    },

    updateType: async (
        id: string,
        type: EventApprovalType,
        adminId: string,
        notes?: string,
        rejectionReason?: string
    ) => {
        const [updated] = await db
            .update(event_approvals)
            .set({
                type,
                admin_id: adminId,
                admin_notes: notes,
                rejection_reason: rejectionReason,
                reviewed_at: new Date(),
                updated_at: new Date(),
            })
            .where(eq(event_approvals.id, id))
            .returning();
        return updated;
    },

    approve: async (id: string, adminId: string, notes?: string) => {
        return eventApprovalQueries.updateType(id, 'approved', adminId, notes);
    },

    reject: async (id: string, adminId: string, reason: string, notes?: string) => {
        return eventApprovalQueries.updateType(id, 'rejected', adminId, notes, reason);
    },

    findByAdminId: async (adminId: string) => {
        return db
            .select({
                approval: event_approvals,
                event: events,
            })
            .from(event_approvals)
            .innerJoin(events, eq(event_approvals.event_id, events.id))
            .where(eq(event_approvals.admin_id, adminId))
            .orderBy(desc(event_approvals.reviewed_at));
    },
};
