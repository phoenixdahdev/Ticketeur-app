import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    integer,
    jsonb
} from 'drizzle-orm/pg-core';
import { events } from './event';
import { event_sessions } from './event-session';

export const speakers = pgTable('speakers', {
    id: uuid('id').defaultRandom().primaryKey(),
    event_id: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
    session_id: uuid('session_id').references(() => event_sessions.id, { onDelete: 'set null' }),
    name: varchar('name', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }),
    company: varchar('company', { length: 255 }),
    bio: text('bio'),
    photo: text('photo'),
    email: varchar('email', { length: 255 }),
    social_links: jsonb('social_links').$type<{
        linkedin?: string;
        twitter?: string;
        website?: string;
        instagram?: string;
    }>(),
    topic: varchar('topic', { length: 500 }),
    session_time: timestamp('session_time'),
    order: integer('order').default(0),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Speaker = typeof speakers.$inferSelect;
export type NewSpeaker = typeof speakers.$inferInsert;
