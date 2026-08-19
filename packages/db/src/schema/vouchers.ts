import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

import { user } from './auth'
import { events } from './events'

// ─── Vouchers (organizer-created discount codes) ────────────────────────────

// A voucher belongs to an organizer and discounts checkout on that organizer's
// events. `eventId` is nullable: NULL means the code works across *all* of the
// organizer's events ("All events" in the create form); a set eventId scopes it
// to that one event. Codes are unique per organizer (case-insensitive), so a
// code resolves to exactly one voucher for a given organizer — no ambiguity
// between an all-events and an event-scoped code of the same name.
export type VoucherDiscountType = 'percent' | 'fixed'

export const vouchers = pgTable(
  'vouchers',
  {
    id: text('id').primaryKey(),
    organizerId: text('organizer_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    // NULL = applies to all of this organizer's events.
    eventId: text('event_id').references(() => events.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    code: text('code').notNull(),
    discountType: text('discount_type').$type<VoucherDiscountType>().notNull(),
    // percent → basis points (2000 = 20%), matching the SERVICE_FEE_BPS
    // convention. fixed → minor units (kobo).
    discountValue: integer('discount_value').notNull(),
    // NULL = unlimited redemptions.
    maxRedemptions: integer('max_redemptions'),
    redeemedCount: integer('redeemed_count').notNull().default(0),
    validFrom: timestamp('valid_from'),
    validUntil: timestamp('valid_until'),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('vouchers_organizer_code_unique').on(
      t.organizerId,
      sql`lower(${t.code})`
    ),
    index('vouchers_organizer_idx').on(t.organizerId),
    index('vouchers_event_idx').on(t.eventId),
  ]
)

export const vouchersRelations = relations(vouchers, ({ one }) => ({
  organizer: one(user, {
    fields: [vouchers.organizerId],
    references: [user.id],
  }),
  event: one(events, {
    fields: [vouchers.eventId],
    references: [events.id],
  }),
}))
