import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    jsonb
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { events } from './event';
import { ticket_types } from './ticket-type';

export const ticketStatuses = ['reserved', 'paid', 'used', 'cancelled', 'refunded'] as const;
export type TicketStatus = typeof ticketStatuses[number];

export const tickets = pgTable('tickets', {
    id: uuid('id').defaultRandom().primaryKey(),
    event_id: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
    ticket_type_id: uuid('ticket_type_id').references(() => ticket_types.id, { onDelete: 'cascade' }).notNull(),
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    payment_id: uuid('payment_id'),
    ticket_number: varchar('ticket_number', { length: 50 }).notNull().unique(),
    qr_code: varchar('qr_code', { length: 500 }).notNull().unique(),
    status: varchar('status', { length: 20 }).$type<TicketStatus>().notNull().default('reserved'),
    attendee_name: varchar('attendee_name', { length: 255 }),
    attendee_email: varchar('attendee_email', { length: 255 }),
    checked_in_at: timestamp('checked_in_at'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
