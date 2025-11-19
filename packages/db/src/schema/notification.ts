import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    boolean,
    jsonb
} from 'drizzle-orm/pg-core';
import { users } from './user';

export const notificationTypes = [
    'event_approved',
    'event_rejected',
    'ticket_purchased',
    'ticket_refunded',
    'team_invitation',
    'team_invitation_accepted',
    'user_verified',
    'user_verification_rejected',
    'payment_successful',
    'payment_failed',
    'event_reminder',
    'system'
] as const;
export type NotificationType = typeof notificationTypes[number];

export const notifications = pgTable('notifications', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    type: varchar('type', { length: 50 }).$type<NotificationType>().notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    data: jsonb('data').$type<Record<string, unknown>>(),
    is_read: boolean('is_read').default(false),
    read_at: timestamp('read_at'),
    created_at: timestamp('created_at').defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
