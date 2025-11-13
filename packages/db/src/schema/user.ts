import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    boolean,
    integer,
    jsonb
} from 'drizzle-orm/pg-core';

export const userTypes = ['admin', 'normal'] as const;
export type UserType = typeof userTypes[number];

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 50 }).unique(),
    first_name: varchar('first_name', { length: 100 }),
    last_name: varchar('last_name', { length: 100 }),
    user_type: varchar('user_type', { length: 20 }).$type<UserType>().notNull().default('normal'),
    password: varchar('password', { length: 255 }),
    avatar: text('avatar'),
    registration_documents: jsonb('registration_documents').$type<string[]>(),
    valid_id: varchar('valid_id', { length: 500 }),
    is_active: boolean('is_active').default(true),
    is_verified: boolean('is_verified').default(false),
    is_onboarded: boolean('is_onboarded').default(false),
    last_login_at: timestamp('last_login_at'),
    email_verified_at: timestamp('email_verified_at'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const verification_otps = pgTable('verification_otps', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    otp: varchar('otp', { length: 6 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    expires_at: timestamp('expires_at').notNull(),
    attempts: integer('attempts').default(0),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type VerificationOTP = typeof verification_otps.$inferSelect;
export type NewVerificationOTP = typeof verification_otps.$inferInsert;
