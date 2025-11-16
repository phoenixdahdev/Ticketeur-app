import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    decimal,
    jsonb
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { tickets } from './ticket';

export const paymentStatuses = ['pending', 'processing', 'successful', 'failed', 'refunded'] as const;
export type PaymentStatus = typeof paymentStatuses[number];

export const paymentMethods = ['card', 'bank_transfer', 'ussd', 'mobile_money'] as const;
export type PaymentMethod = typeof paymentMethods[number];

export const paymentProviders = ['paystack', 'flutterwave', 'stripe'] as const;
export type PaymentProvider = typeof paymentProviders[number];

export const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    ticket_id: uuid('ticket_id').references(() => tickets.id, { onDelete: 'set null' }),
    transaction_reference: varchar('transaction_reference', { length: 255 }).notNull().unique(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    fee: decimal('fee', { precision: 10, scale: 2 }).default('0'),
    net_amount: decimal('net_amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).notNull().default('NGN'),
    payment_method: varchar('payment_method', { length: 50 }).$type<PaymentMethod>(),
    payment_provider: varchar('payment_provider', { length: 50 }).$type<PaymentProvider>().notNull(),
    status: varchar('status', { length: 20 }).$type<PaymentStatus>().notNull().default('pending'),
    provider_response: jsonb('provider_response').$type<Record<string, unknown>>(),
    failure_reason: text('failure_reason'),
    paid_at: timestamp('paid_at'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
