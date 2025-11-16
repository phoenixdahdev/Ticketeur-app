import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    boolean,
    integer,
    decimal,
    jsonb
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { teams } from './team';

export const eventStatuses = [
    'draft',
    'pending_approval',
    'approved',
    'rejected',
    'published',
    'cancelled',
    'completed'
] as const;
export type EventStatus = typeof eventStatuses[number];

export const eventTypes = [
    'concert',
    'conference',
    'workshop',
    'seminar',
    'festival',
    'sports',
    'exhibition',
    'networking',
    'party',
    'other'
] as const;
export type EventType = typeof eventTypes[number];

export const events = pgTable('events', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizer_id: uuid('organizer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    team_id: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    banner_image: text('banner_image'),
    venue_name: varchar('venue_name', { length: 255 }),
    venue_address: text('venue_address'),
    latitude: decimal('latitude', { precision: 10, scale: 8 }),
    longitude: decimal('longitude', { precision: 11, scale: 8 }),
    event_type: varchar('event_type', { length: 50 }).$type<EventType>().notNull().default('other'),
    status: varchar('status', { length: 30 }).$type<EventStatus>().notNull().default('draft'),
    start_date: timestamp('start_date').notNull(),
    end_date: timestamp('end_date').notNull(),
    max_attendees: integer('max_attendees'),
    is_free: boolean('is_free').default(false),
    is_featured: boolean('is_featured').default(false),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
