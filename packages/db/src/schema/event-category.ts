import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    boolean
} from 'drizzle-orm/pg-core';

export const event_categories = pgTable('event_categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    description: text('description'),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type EventCategory = typeof event_categories.$inferSelect;
export type NewEventCategory = typeof event_categories.$inferInsert;
