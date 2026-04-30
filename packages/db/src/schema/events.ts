import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  index,
  boolean,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { user } from './auth'

// ─── Events ────────────────────────────────────────────────────────────────

export type EventStatus = 'draft' | 'in-review' | 'upcoming' | 'archived'

export const events = pgTable(
  'events',
  {
    id: text('id').primaryKey(),
    organizerId: text('organizer_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    // ISO date string (YYYY-MM-DD) — separate from time so the form can edit each independently
    eventDate: text('event_date').notNull(),
    eventTime: text('event_time').notNull(),
    location: text('location').notNull(),
    bannerUrl: text('banner_url'),
    features: jsonb('features').$type<string[]>().notNull().default([]),
    status: text('status').$type<EventStatus>().notNull().default('draft'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [
    index('events_organizer_idx').on(t.organizerId),
    index('events_status_idx').on(t.status),
  ]
)

export const eventsRelations = relations(events, ({ many, one }) => ({
  organizer: one(user, {
    fields: [events.organizerId],
    references: [user.id],
  }),
  tiers: many(ticketTiers),
  vendors: many(eventVendors),
  externalInvites: many(externalVendorInvites),
  orders: many(orders),
  activity: many(activityLog),
}))

// ─── Ticket Tiers ──────────────────────────────────────────────────────────

export const ticketTiers = pgTable(
  'ticket_tiers',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    name: text('name').notNull(),
    quantity: integer('quantity').notNull(),
    // Stored in minor units (e.g., kobo / cents) to avoid float drift
    priceMinor: integer('price_minor').notNull(),
    sold: integer('sold').notNull().default(0),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('ticket_tiers_event_idx').on(t.eventId)]
)

export const ticketTiersRelations = relations(ticketTiers, ({ one, many }) => ({
  event: one(events, {
    fields: [ticketTiers.eventId],
    references: [events.id],
  }),
  orders: many(orders),
}))

// ─── Event Vendors (registered vendors assigned/invited) ──────────────────

export type EventVendorStatus = 'invited' | 'accepted' | 'declined'

export const eventVendors = pgTable(
  'event_vendors',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    vendorId: text('vendor_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    status: text('status')
      .$type<EventVendorStatus>()
      .notNull()
      .default('invited'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('event_vendors_event_idx').on(t.eventId),
    index('event_vendors_vendor_idx').on(t.vendorId),
  ]
)

export const eventVendorsRelations = relations(eventVendors, ({ one }) => ({
  event: one(events, {
    fields: [eventVendors.eventId],
    references: [events.id],
  }),
  vendor: one(user, {
    fields: [eventVendors.vendorId],
    references: [user.id],
  }),
}))

// ─── External Vendor Invites (not registered on platform) ─────────────────

export type ExternalVendorInviteStatus = 'invited' | 'accepted' | 'declined'

export const externalVendorInvites = pgTable(
  'external_vendor_invites',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    businessName: text('business_name').notNull(),
    contactName: text('contact_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    status: text('status')
      .$type<ExternalVendorInviteStatus>()
      .notNull()
      .default('invited'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [index('external_vendor_invites_event_idx').on(t.eventId)]
)

export const externalVendorInvitesRelations = relations(
  externalVendorInvites,
  ({ one }) => ({
    event: one(events, {
      fields: [externalVendorInvites.eventId],
      references: [events.id],
    }),
  })
)

// ─── Orders ───────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'paid' | 'refunded' | 'cancelled' | 'failed'

export const orders = pgTable(
  'orders',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    tierId: text('tier_id')
      .notNull()
      .references(() => ticketTiers.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    buyerId: text('buyer_id').references(() => user.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
    // Guest checkout — captured even when buyerId is set so we have a record
    // of what was entered at purchase time.
    buyerEmail: text('buyer_email').notNull().default(''),
    buyerName: text('buyer_name').notNull().default(''),
    buyerPhone: text('buyer_phone').notNull().default(''),
    quantity: integer('quantity').notNull(),
    totalMinor: integer('total_minor').notNull(),
    status: text('status').$type<OrderStatus>().notNull().default('pending'),
    // Flutterwave correlation — tx_ref is what we send, transaction_id is
    // what FW returns once the customer pays.
    flwTxRef: text('flw_tx_ref'),
    flwTransactionId: text('flw_transaction_id'),
    ticketsPdfUrl: text('tickets_pdf_url'),
    paidAt: timestamp('paid_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('orders_event_idx').on(t.eventId),
    index('orders_buyer_idx').on(t.buyerId),
    index('orders_flw_tx_ref_idx').on(t.flwTxRef),
    index('orders_buyer_email_idx').on(t.buyerEmail),
  ]
)

export const ordersRelations = relations(orders, ({ one, many }) => ({
  event: one(events, {
    fields: [orders.eventId],
    references: [events.id],
  }),
  tier: one(ticketTiers, {
    fields: [orders.tierId],
    references: [ticketTiers.id],
  }),
  buyer: one(user, {
    fields: [orders.buyerId],
    references: [user.id],
  }),
  tickets: many(tickets),
}))

// ─── Tickets ──────────────────────────────────────────────────────────────

export const tickets = pgTable(
  'tickets',
  {
    id: text('id').primaryKey(),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    tierId: text('tier_id')
      .notNull()
      .references(() => ticketTiers.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    // Opaque token used for QR + check-in. Distinct from the row id so we
    // can rotate it (e.g. on reissue) without breaking foreign keys.
    code: text('code').notNull().unique(),
    checkedIn: boolean('checked_in').notNull().default(false),
    checkedInAt: timestamp('checked_in_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('tickets_order_idx').on(t.orderId),
    index('tickets_event_idx').on(t.eventId),
    index('tickets_code_idx').on(t.code),
  ]
)

export const ticketsRelations = relations(tickets, ({ one }) => ({
  order: one(orders, {
    fields: [tickets.orderId],
    references: [orders.id],
  }),
  event: one(events, {
    fields: [tickets.eventId],
    references: [events.id],
  }),
  tier: one(ticketTiers, {
    fields: [tickets.tierId],
    references: [ticketTiers.id],
  }),
}))

// ─── Activity Log ─────────────────────────────────────────────────────────

export type ActivityType =
  | 'event.created'
  | 'event.updated'
  | 'event.archived'
  | 'event.published'
  | 'event.deleted'
  | 'order.placed'

export const activityLog = pgTable(
  'activity_log',
  {
    id: text('id').primaryKey(),
    organizerId: text('organizer_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    eventId: text('event_id').references(() => events.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
    type: text('type').$type<ActivityType>().notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('activity_log_organizer_idx').on(t.organizerId),
    index('activity_log_created_idx').on(t.createdAt),
  ]
)

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  organizer: one(user, {
    fields: [activityLog.organizerId],
    references: [user.id],
  }),
  event: one(events, {
    fields: [activityLog.eventId],
    references: [events.id],
  }),
}))
