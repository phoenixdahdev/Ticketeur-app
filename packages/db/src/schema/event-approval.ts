import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { events } from './event';

export const eventApprovalTypes = ['pending', 'approved', 'rejected'] as const;
export type EventApprovalType = typeof eventApprovalTypes[number];

export const event_approvals = pgTable('event_approvals', {
    id: uuid('id').defaultRandom().primaryKey(),
    event_id: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
    admin_id: uuid('admin_id').references(() => users.id, { onDelete: 'set null' }),
    type: varchar('type', { length: 20 }).$type<EventApprovalType>().notNull().default('pending'),
    admin_notes: text('admin_notes'),
    rejection_reason: text('rejection_reason'),
    reviewed_at: timestamp('reviewed_at'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type EventApproval = typeof event_approvals.$inferSelect;
export type NewEventApproval = typeof event_approvals.$inferInsert;
