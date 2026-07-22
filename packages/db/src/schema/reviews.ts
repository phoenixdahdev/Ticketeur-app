import {
  pgTable,
  text,
  integer,
  timestamp,
  index,
  unique,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

import { user } from './auth'

// ─── Vendor Reviews ────────────────────────────────────────────────────────

// A review is either from a signed-in reviewer (reviewerId set, guestName/
// guestEmail null) or a guest (reviewerId null, guestName + guestEmail set).
// One review per reviewer per vendor — resubmitting updates the existing row
// rather than creating a duplicate. Two unique indexes enforce that: one per
// (vendor, reviewerId) for signed-in reviewers, one per (vendor, guestEmail)
// for guests — Postgres treats every NULL as distinct, so each index only
// constrains the rows it applies to (partial index via `.where`).
export const vendorReviews = pgTable(
  'vendor_reviews',
  {
    id: text('id').primaryKey(),
    vendorId: text('vendor_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    reviewerId: text('reviewer_id').references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    guestName: text('guest_name'),
    guestEmail: text('guest_email'),
    rating: integer('rating').notNull(),
    comment: text('comment').notNull().default(''),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('vendor_reviews_vendor_idx').on(t.vendorId),
    unique('vendor_reviews_vendor_reviewer_unique').on(t.vendorId, t.reviewerId),
    uniqueIndex('vendor_reviews_vendor_guest_email_unique')
      .on(t.vendorId, t.guestEmail)
      .where(sql`${t.reviewerId} is null`),
  ]
)

export const vendorReviewsRelations = relations(vendorReviews, ({ one }) => ({
  vendor: one(user, {
    fields: [vendorReviews.vendorId],
    references: [user.id],
    relationName: 'vendorReviews_vendor',
  }),
  reviewer: one(user, {
    fields: [vendorReviews.reviewerId],
    references: [user.id],
    relationName: 'vendorReviews_reviewer',
  }),
}))
