import {
    pgTable,
    uuid,
    varchar,
    timestamp
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { teams } from './team';
import { type TeamMemberRole } from './team-member';

export const teamInvitationStatuses = ['pending', 'accepted', 'declined', 'expired'] as const;
export type TeamInvitationStatus = typeof teamInvitationStatuses[number];

export const team_invitations = pgTable('team_invitations', {
    id: uuid('id').defaultRandom().primaryKey(),
    team_id: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
    invited_by: uuid('invited_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    invited_user_id: uuid('invited_user_id').references(() => users.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 255 }).notNull(),
    role: varchar('role', { length: 20 }).$type<TeamMemberRole>().notNull().default('member'),
    status: varchar('status', { length: 20 }).$type<TeamInvitationStatus>().notNull().default('pending'),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expires_at: timestamp('expires_at').notNull(),
    responded_at: timestamp('responded_at'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type TeamInvitation = typeof team_invitations.$inferSelect;
export type NewTeamInvitation = typeof team_invitations.$inferInsert;
