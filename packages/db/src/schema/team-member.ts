import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    unique
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { teams } from './team';

export const teamMemberRoles = ['owner', 'admin', 'member'] as const;
export type TeamMemberRole = typeof teamMemberRoles[number];

export const team_members = pgTable('team_members', {
    id: uuid('id').defaultRandom().primaryKey(),
    team_id: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    role: varchar('role', { length: 20 }).$type<TeamMemberRole>().notNull().default('member'),
    joined_at: timestamp('joined_at').defaultNow().notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
    unique().on(table.team_id, table.user_id),
]);

export type TeamMember = typeof team_members.$inferSelect;
export type NewTeamMember = typeof team_members.$inferInsert;
