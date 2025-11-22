import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'
import { users } from './user'
import { events } from './event'
import { type EventMemberRole } from './event-member'

export const eventInvitationStatuses = [
  'pending',
  'accepted',
  'declined',
  'expired',
] as const
export type EventInvitationStatus = (typeof eventInvitationStatuses)[number]

export const event_invitations = pgTable('event_invitations', {
  id: uuid('id').defaultRandom().primaryKey(),
  event_id: uuid('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .notNull(),
  invited_by: uuid('invited_by')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  // Nullable - will be set if the user exists in the system
  invited_user_id: uuid('invited_user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  // Email is always required - used to send invitation
  email: varchar('email', { length: 255 }).notNull(),
  // Name provided by inviter (for non-existing users)
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 20 })
    .$type<EventMemberRole>()
    .notNull()
    .default('staff'),
  status: varchar('status', { length: 20 })
    .$type<EventInvitationStatus>()
    .notNull()
    .default('pending'),
  // Unique token for accepting/declining invitation
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires_at: timestamp('expires_at').notNull(),
  responded_at: timestamp('responded_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export type EventInvitation = typeof event_invitations.$inferSelect
export type NewEventInvitation = typeof event_invitations.$inferInsert
