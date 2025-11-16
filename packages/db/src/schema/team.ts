import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    boolean
} from 'drizzle-orm/pg-core';
import { users } from './user';

export const teams = pgTable('teams', {
    id: uuid('id').defaultRandom().primaryKey(),
    owner_id: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    logo: text('logo'),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
