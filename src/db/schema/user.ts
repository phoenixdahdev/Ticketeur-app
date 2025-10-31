import {
    uuid,
    varchar,
    text,
    timestamp,
    boolean,
    integer,
    jsonb
} from 'drizzle-orm/pg-core'
import { BaseEntity, createBaseTable } from './base-table';


export const userTypes = ['admin', 'normal'] as const;
export type UserType = typeof userTypes[number];

export const users = createBaseTable('users', {
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 50 }).unique(),
    first_name: varchar('first_name', { length: 100 }),
    last_name: varchar('last_name', { length: 100 }),


    user_type: varchar('user_type', { length: 20 }).notNull().default('normal'),

    password: varchar('password', { length: 255 }),

    avatar: text('avatar'),

    registration_documents: jsonb('registration_documents').$type<string[]>(),
    valid_id: varchar('valid_id', { length: 500 }),

    is_active: boolean('is_active').default(true),
    is_verified: boolean('is_verified').default(false),
    is_onboarded: boolean('is_onboarded').default(false),
    onboarding_status: varchar('onboarding_status', { length: 20 }).default('pending'), // pending, approved, declined


    google_id: varchar('google_id', { length: 255 }),

    last_login_at: timestamp('last_login_at'),
    email_verified_at: timestamp('email_verified_at'),
});

export const verification_otps = createBaseTable('verification_otps', {
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    otp: varchar('otp', { length: 6 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    expires_at: timestamp('expires_at').notNull(),
    attempts: integer('attempts').default(0),
});


export type User = typeof users.$inferSelect & BaseEntity;
export type NewUser = typeof users.$inferInsert;

export type VerificationOTP = typeof verification_otps.$inferSelect & BaseEntity;
export type NewVerificationOTP = typeof verification_otps.$inferInsert;
