import { z } from 'zod'
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  ne,
  or,
  sql,
} from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

import {
  events,
  eventVendors,
  ticketTiers,
  user,
} from '@ticketur/db'
import type { EventStatus } from '@ticketur/db'

import { adminProcedure, createTRPCRouter } from '../../trpc'

const TABS = ['all', 'published', 'archived', 'flagged'] as const
const SORT_FIELDS = ['date', 'sales', 'name'] as const
const DIR_VALUES = ['asc', 'desc'] as const

const listSchema = z.object({
  tab: z.enum(TABS).default('all'),
  q: z.string().default(''),
  sort: z.enum(SORT_FIELDS).default('date'),
  dir: z.enum(DIR_VALUES).default('desc'),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
})

// Drafts are organizer-only; they shouldn't surface in the admin list.
// We also currently treat "flagged" as a placeholder until the report
// table lands during the moderation pass.
const NOT_DRAFT = ne(events.status, 'draft')

function makeReference(id: string) {
  return `#${id.slice(0, 8).toUpperCase()}`
}

type AdminEventStatus = 'published' | 'archived' | 'flagged' | 'suspended'

function mapStatus(s: EventStatus): AdminEventStatus {
  if (s === 'archived') return 'archived'
  if (s === 'suspended') return 'suspended'
  // 'upcoming' renders as Published; 'in-review' / 'draft' shouldn't reach
  // the list, but if they do treat them as published-ish for now.
  return 'published'
}

export const adminEventsRouter = createTRPCRouter({
  stats: adminProcedure.query(async ({ ctx }) => {
    const [row] = await ctx.db
      .select({
        total: count(events.id),
        active: sql<number>`count(*) filter (where ${events.status} = 'upcoming')`,
        archived: sql<number>`count(*) filter (where ${events.status} = 'archived')`,
      })
      .from(events)
      .where(NOT_DRAFT)

    return {
      total: Number(row?.total ?? 0),
      active: Number(row?.active ?? 0),
      archived: Number(row?.archived ?? 0),
      // Flagged needs a report/flag table; tracked for the moderation pass.
      flagged: 0,
    }
  }),

  list: adminProcedure.input(listSchema).query(async ({ ctx, input }) => {
    const { tab, q, sort, dir, page, pageSize } = input

    const filters = [NOT_DRAFT]
    if (tab === 'published') filters.push(eq(events.status, 'upcoming'))
    else if (tab === 'archived') filters.push(eq(events.status, 'archived'))
    else if (tab === 'flagged') {
      // No flag concept yet — return an empty page until reports table exists.
      filters.push(sql`false`)
    }
    if (q.trim().length > 0) {
      const needle = `%${q.trim()}%`
      filters.push(
        or(ilike(events.title, needle), ilike(events.location, needle))!
      )
    }
    const where = and(...filters)

    const soldExpr = sql<number>`coalesce(sum(${ticketTiers.sold}), 0)`
    const totalExpr = sql<number>`coalesce(sum(${ticketTiers.quantity}), 0)`

    const orderBy = (() => {
      if (sort === 'name') {
        return dir === 'asc' ? asc(events.title) : desc(events.title)
      }
      if (sort === 'sales') {
        return dir === 'asc' ? asc(soldExpr) : desc(soldExpr)
      }
      return dir === 'asc' ? asc(events.eventDate) : desc(events.eventDate)
    })()

    const [rows, totalRow] = await Promise.all([
      ctx.db
        .select({
          id: events.id,
          title: events.title,
          eventDate: events.eventDate,
          endDate: events.endDate,
          status: events.status,
          bannerUrl: events.bannerUrl,
          organizerName: user.name,
          organizerOrgName: user.orgName,
          sold: soldExpr,
          total: totalExpr,
        })
        .from(events)
        .innerJoin(user, eq(events.organizerId, user.id))
        .leftJoin(ticketTiers, eq(ticketTiers.eventId, events.id))
        .where(where)
        .groupBy(events.id, user.id)
        .orderBy(orderBy)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      ctx.db
        .select({ value: count(events.id) })
        .from(events)
        .where(where),
    ])

    const total = Number(totalRow[0]?.value ?? 0)

    return {
      rows: rows.map((r) => ({
        id: r.id,
        title: r.title,
        reference: makeReference(r.id),
        organizerName: r.organizerOrgName ?? r.organizerName,
        date: r.eventDate,
        endDate: r.endDate,
        status: mapStatus(r.status),
        sold: Number(r.sold),
        total: Number(r.total),
        thumbnailUrl: r.bannerUrl ?? '',
      })),
      total,
    }
  }),

  byId: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const [ev] = await ctx.db
        .select()
        .from(events)
        .where(and(eq(events.id, input.id), NOT_DRAFT))
        .limit(1)

      if (!ev) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      }

      const [organizer] = await ctx.db
        .select({
          id: user.id,
          name: user.name,
          orgName: user.orgName,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          banned: user.banned,
          banExpires: user.banExpires,
        })
        .from(user)
        .where(eq(user.id, ev.organizerId))
        .limit(1)

      const tierRows = await ctx.db
        .select()
        .from(ticketTiers)
        .where(eq(ticketTiers.eventId, ev.id))
        .orderBy(asc(ticketTiers.priceMinor), asc(ticketTiers.sortOrder))

      const totalSold = tierRows.reduce((acc, t) => acc + t.sold, 0)
      const totalQuantity = tierRows.reduce((acc, t) => acc + t.quantity, 0)
      const totalRevenue = tierRows.reduce(
        (acc, t) => acc + t.sold * t.priceMinor,
        0
      )

      const vendorRows = await ctx.db
        .select({
          id: eventVendors.id,
          vendorId: user.id,
          name: user.name,
          businessName: user.businessName,
          category: user.businessCategory,
          description: user.businessDescription,
          image: user.image,
        })
        .from(eventVendors)
        .innerJoin(user, eq(eventVendors.vendorId, user.id))
        .where(
          and(
            eq(eventVendors.eventId, ev.id),
            eq(eventVendors.status, 'accepted')
          )
        )

      return {
        id: ev.id,
        title: ev.title,
        reference: makeReference(ev.id),
        description: ev.description,
        bannerUrl: ev.bannerUrl ?? '',
        thumbnailUrl: ev.bannerUrl ?? '',
        date: ev.eventDate,
        endDate: ev.endDate,
        eventTime: ev.eventTime,
        location: ev.location,
        status: mapStatus(ev.status),
        features: ev.features ?? [],
        sold: totalSold,
        total: totalQuantity,
        totalRevenue,
        // Real change-vs-last-week needs a sales history table; surface 0
        // until that lands.
        revenueChangePct: 0,
        organizer: organizer
          ? {
              id: organizer.id,
              name: organizer.orgName ?? organizer.name,
              email: organizer.email,
              image: organizer.image ?? null,
              joinedAt: organizer.createdAt.toISOString(),
              status: organizer.banned ? 'suspended' : 'active',
            }
          : null,
        organizerName: organizer?.orgName ?? organizer?.name ?? '',
        tiers: tierRows.map((t) => ({
          id: t.id,
          name: t.name,
          detail: `Tier ${t.sortOrder + 1} · ${t.quantity} total`,
          sold: t.sold,
          total: t.quantity,
          price: t.priceMinor,
          status: (t.sold >= t.quantity ? 'sold-out' : 'active') as
            | 'sold-out'
            | 'active'
            | 'early',
        })),
        vendors: vendorRows.map((v) => ({
          id: v.id,
          name: v.businessName ?? v.name,
          category: v.category ?? '',
          imageUrl: v.image ?? '',
          description: v.description ?? '',
        })),
      }
    }),

  // Hide a published event from every public surface. Public queries all
  // filter status = 'upcoming', so flipping to 'suspended' is enough to pull
  // it from listings, detail pages, and checkout.
  suspend: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [ev] = await ctx.db
        .select({ id: events.id, status: events.status })
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1)
      if (!ev) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      }
      if (ev.status !== 'upcoming') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only a published event can be suspended.',
        })
      }
      await ctx.db
        .update(events)
        .set({ status: 'suspended', updatedAt: new Date() })
        .where(eq(events.id, ev.id))
      return { ok: true as const }
    }),

  // Restore a suspended event back to the public site.
  unsuspend: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [ev] = await ctx.db
        .select({ id: events.id, status: events.status })
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1)
      if (!ev) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      }
      if (ev.status !== 'suspended') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This event is not suspended.',
        })
      }
      await ctx.db
        .update(events)
        .set({ status: 'upcoming', updatedAt: new Date() })
        .where(eq(events.id, ev.id))
      return { ok: true as const }
    }),
})
