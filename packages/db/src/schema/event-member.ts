import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    unique
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { events } from './event';

export const eventMemberRoles = ['organizer', 'coordinator', 'staff', 'volunteer'] as const;
export type EventMemberRole = typeof eventMemberRoles[number];

export const event_members = pgTable('event_members', {
    id: uuid('id').defaultRandom().primaryKey(),
    event_id: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    role: varchar('role', { length: 30 }).$type<EventMemberRole>().notNull().default('staff'),
    added_at: timestamp('added_at').defaultNow().notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
    unique().on(table.event_id, table.user_id),
]);

export type EventMember = typeof event_members.$inferSelect;
export type NewEventMember = typeof event_members.$inferInsert;
