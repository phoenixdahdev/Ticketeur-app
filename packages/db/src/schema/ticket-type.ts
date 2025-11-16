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
import { events } from './event';

export const ticket_types = pgTable('ticket_types', {
    id: uuid('id').defaultRandom().primaryKey(),
    event_id: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    quantity_available: integer('quantity_available').notNull(),
    quantity_sold: integer('quantity_sold').default(0).notNull(),
    max_per_order: integer('max_per_order').default(10),
    sales_start: timestamp('sales_start'),
    sales_end: timestamp('sales_end'),
    is_active: boolean('is_active').default(true),
    benefits: jsonb('benefits').$type<string[]>(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type TicketType = typeof ticket_types.$inferSelect;
export type NewTicketType = typeof ticket_types.$inferInsert;
