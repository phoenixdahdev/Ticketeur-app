import { z } from 'zod'
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  sql,
} from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

import {
  events,
  orders,
  ticketTiers,
  user,
} from '@ticketur/db'

import { adminProcedure, createTRPCRouter } from '../../trpc'

const SORT_FIELDS = ['date', 'amount', 'fee'] as const
const DIR_VALUES = ['asc', 'desc'] as const

const listSchema = z.object({
  q: z.string().default(''),
  sort: z.enum(SORT_FIELDS).default('date'),
  dir: z.enum(DIR_VALUES).default('desc'),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
})

// Only paid orders count as transactions in the admin view.
const PAID = eq(orders.status, 'paid')

function makeReference(id: string) {
  return `TXN-${id.slice(0, 8).toUpperCase()}`
}

export const adminTransactionsRouter = createTRPCRouter({
  stats: adminProcedure.query(async ({ ctx }) => {
    const [row] = await ctx.db
      .select({
        totalRevenue: sql<number>`coalesce(sum(${orders.totalMinor}), 0)`,
        totalFees: sql<number>`coalesce(sum(${orders.feeMinor}), 0)`,
      })
      .from(orders)
      .where(PAID)

    return {
      totalRevenue: Number(row?.totalRevenue ?? 0),
      totalFees: Number(row?.totalFees ?? 0),
    }
  }),

  list: adminProcedure.input(listSchema).query(async ({ ctx, input }) => {
    const { q, sort, dir, page, pageSize } = input

    const filters = [PAID]
    if (q.trim().length > 0) {
      const needle = `%${q.trim()}%`
      filters.push(
        or(
          ilike(orders.buyerName, needle),
          ilike(orders.buyerEmail, needle),
          ilike(events.title, needle),
          ilike(orders.flwTxRef, needle)
        )!
      )
    }
    const where = and(...filters)

    const orderBy = (() => {
      const col =
        sort === 'amount'
          ? orders.totalMinor
          : sort === 'fee'
            ? orders.feeMinor
            : orders.paidAt
      return dir === 'asc' ? asc(col) : desc(col)
    })()

    const [rows, totalRow] = await Promise.all([
      ctx.db
        .select({
          id: orders.id,
          createdAt: orders.createdAt,
          paidAt: orders.paidAt,
          quantity: orders.quantity,
          totalMinor: orders.totalMinor,
          feeMinor: orders.feeMinor,
          buyerName: orders.buyerName,
          buyerEmail: orders.buyerEmail,
          eventTitle: events.title,
          tierName: ticketTiers.name,
          buyerImage: user.image,
        })
        .from(orders)
        .innerJoin(events, eq(orders.eventId, events.id))
        .innerJoin(ticketTiers, eq(orders.tierId, ticketTiers.id))
        .leftJoin(user, eq(orders.buyerId, user.id))
        .where(where)
        .orderBy(orderBy)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      ctx.db
        .select({ value: count(orders.id) })
        .from(orders)
        .innerJoin(events, eq(orders.eventId, events.id))
        .where(where),
    ])

    const total = Number(totalRow[0]?.value ?? 0)

    return {
      rows: rows.map((r) => ({
        id: r.id,
        reference: makeReference(r.id),
        attendeeName: r.buyerName || 'Guest',
        attendeeEmail: r.buyerEmail,
        attendeeAvatarUrl: r.buyerImage ?? null,
        eventName: r.eventTitle,
        tier: r.tierName,
        qty: r.quantity,
        amount: r.totalMinor,
        fee: r.feeMinor,
        date: (r.paidAt ?? r.createdAt).toISOString(),
      })),
      total,
    }
  }),

  byId: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select({
          id: orders.id,
          createdAt: orders.createdAt,
          paidAt: orders.paidAt,
          quantity: orders.quantity,
          subtotalMinor: orders.subtotalMinor,
          totalMinor: orders.totalMinor,
          feeMinor: orders.feeMinor,
          buyerName: orders.buyerName,
          buyerEmail: orders.buyerEmail,
          buyerImage: user.image,
          status: orders.status,
          eventTitle: events.title,
          eventDate: events.eventDate,
          eventTime: events.eventTime,
          eventLocation: events.location,
          tierName: ticketTiers.name,
          tierPrice: ticketTiers.priceMinor,
        })
        .from(orders)
        .innerJoin(events, eq(orders.eventId, events.id))
        .innerJoin(ticketTiers, eq(orders.tierId, ticketTiers.id))
        .leftJoin(user, eq(orders.buyerId, user.id))
        .where(and(eq(orders.id, input.id), PAID))
        .limit(1)

      if (!row) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Transaction not found',
        })
      }

      const paidAt = row.paidAt ?? row.createdAt

      return {
        id: row.id,
        reference: makeReference(row.id),
        date: paidAt.toISOString(),
        amount: row.totalMinor,
        fee: row.feeMinor,
        // Flutterwave doesn't get persisted yet; default for now.
        paymentMethod: 'Card' as const,
        attendee: {
          name: row.buyerName || 'Guest',
          email: row.buyerEmail,
          avatarUrl: row.buyerImage ?? null,
        },
        event: {
          name: row.eventTitle,
          date: row.eventDate,
          time: row.eventTime,
          location: row.eventLocation,
        },
        ticket: {
          tier: row.tierName,
          qty: row.quantity,
          amount: row.subtotalMinor || row.tierPrice * row.quantity,
        },
      }
    }),
})
