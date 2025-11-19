import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    integer
} from 'drizzle-orm/pg-core';
import { events } from './event';

export const event_sessions = pgTable('event_sessions', {
    id: uuid('id').defaultRandom().primaryKey(),
    event_id: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    location: varchar('location', { length: 255 }),
    start_time: timestamp('start_time').notNull(),
    end_time: timestamp('end_time').notNull(),
    order: integer('order').default(0),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type EventSession = typeof event_sessions.$inferSelect;
export type NewEventSession = typeof event_sessions.$inferInsert;
