import { pgTable, text, integer, timestamp, index, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { user } from './auth'

// ─── Vendor Reviews ────────────────────────────────────────────────────────

// One review per reviewer per vendor — resubmitting updates the existing row
// rather than creating a duplicate (enforced by the unique index below).
export const vendorReviews = pgTable(
  'vendor_reviews',
  {
    id: text('id').primaryKey(),
    vendorId: text('vendor_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    reviewerId: text('reviewer_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    rating: integer('rating').notNull(),
    comment: text('comment').notNull().default(''),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('vendor_reviews_vendor_idx').on(t.vendorId),
    unique('vendor_reviews_vendor_reviewer_unique').on(t.vendorId, t.reviewerId),
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
