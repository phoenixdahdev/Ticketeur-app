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
  not,
  or,
  sql,
} from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { tasks } from '@trigger.dev/sdk'
import { addDays, format } from 'date-fns'

import {
  events,
  eventVendors,
  orders,
  session,
  ticketTiers,
  user,
} from '@ticketur/db'

import { adminProcedure, createTRPCRouter } from '../../trpc'

const ROLE_TABS = ['all', 'attendee', 'organizer', 'vendor'] as const
const SORT_FIELDS = ['name', 'role', 'joined', 'status'] as const
const DIR_VALUES = ['asc', 'desc'] as const

const listSchema = z.object({
  tab: z.enum(ROLE_TABS).default('all'),
  q: z.string().default(''),
  sort: z.enum(SORT_FIELDS).default('joined'),
  dir: z.enum(DIR_VALUES).default('desc'),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
})

// Bans always supersede the approval state, so if you switch on `status`
// for action branching the suspended/disabled branches still work for
// vendors. Approval values only show when the user is not banned.
type AdminUserStatus =
  | 'active'
  | 'suspended'
  | 'disabled'
  | 'incomplete'
  | 'pending'
  | 'approved'
  | 'rejected'
type AdminUserListRole = 'attendee' | 'organizer' | 'vendor'
type VendorApprovalStatus = 'pending' | 'approved' | 'rejected' | null

function deriveStatus(
  role: AdminUserListRole,
  banned: boolean | null,
  banExpires: Date | null,
  approvalStatus: VendorApprovalStatus
): AdminUserStatus {
  if (banned) {
    // permanent ban (no expiry) = disabled; temp ban = suspended
    if (banExpires === null) return 'disabled'
    return 'suspended'
  }
  if (role === 'vendor') {
    // null = signed up but profile not yet submitted for review
    if (approvalStatus === null) return 'incomplete'
    return approvalStatus
  }
  return 'active'
}

// Always exclude admins from results — admin app should not surface
// platform admins to itself.
const NOT_ADMIN = ne(user.role, 'admin')

// Selects an actionable target: not an admin, not the caller themselves.
async function findActionTarget(
  db: typeof import('@ticketur/db').db,
  callerId: string,
  targetId: string
) {
  const [target] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
    .from(user)
    .where(and(eq(user.id, targetId), NOT_ADMIN))
    .limit(1)

  if (!target) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
  }
  if (target.id === callerId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot moderate your own account',
    })
  }
  return target
}

export const adminUsersRouter = createTRPCRouter({
  stats: adminProcedure.query(async ({ ctx }) => {
    const [row] = await ctx.db
      .select({
        total: count(user.id),
        attendees: sql<number>`count(*) filter (where ${user.role} = 'attendee' or ${user.role} is null)`,
        organizers: sql<number>`count(*) filter (where ${user.role} = 'organizer')`,
        vendors: sql<number>`count(*) filter (where ${user.role} = 'vendor')`,
      })
      .from(user)
      .where(NOT_ADMIN)

    return {
      total: Number(row?.total ?? 0),
      attendees: Number(row?.attendees ?? 0),
      organizers: Number(row?.organizers ?? 0),
      vendors: Number(row?.vendors ?? 0),
    }
  }),

  list: adminProcedure.input(listSchema).query(async ({ ctx, input }) => {
    const { tab, q, sort, dir, page, pageSize } = input

    const filters = [NOT_ADMIN]
    if (tab !== 'all') filters.push(eq(user.role, tab))
    if (q.trim().length > 0) {
      const needle = `%${q.trim()}%`
      filters.push(
        or(ilike(user.name, needle), ilike(user.email, needle))!
      )
    }
    const where = and(...filters)

    const orderCol =
      sort === 'name'
        ? user.name
        : sort === 'role'
          ? user.role
          : sort === 'status'
            ? user.banned
            : user.createdAt

    const orderBy = dir === 'asc' ? asc(orderCol) : desc(orderCol)

    const [rows, totalRow] = await Promise.all([
      ctx.db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          image: user.image,
          banned: user.banned,
          banExpires: user.banExpires,
          vendorApprovalStatus: user.vendorApprovalStatus,
        })
        .from(user)
        .where(where)
        .orderBy(orderBy)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      ctx.db
        .select({ value: count(user.id) })
        .from(user)
        .where(where),
    ])

    const total = Number(totalRow[0]?.value ?? 0)

    return {
      rows: rows.map((r) => {
        const role = (r.role ?? 'attendee') as AdminUserListRole
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          role,
          joinedAt: r.createdAt.toISOString(),
          status: deriveStatus(
            role,
            r.banned ?? null,
            r.banExpires ?? null,
            r.vendorApprovalStatus as VendorApprovalStatus
          ),
          avatarUrl: r.image ?? null,
        }
      }),
      total,
    }
  }),

  byId: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const [u] = await ctx.db
        .select()
        .from(user)
        .where(and(eq(user.id, input.id), NOT_ADMIN))
        .limit(1)

      if (!u) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      const role = (u.role ?? 'attendee') as AdminUserListRole
      const base = {
        id: u.id,
        name: u.name,
        email: u.email,
        joinedAt: u.createdAt.toISOString(),
        status: deriveStatus(
          role,
          u.banned ?? null,
          u.banExpires ?? null,
          (u.vendorApprovalStatus ?? null) as VendorApprovalStatus
        ),
        avatarUrl: u.image ?? null,
      }

      if (role === 'attendee') {
        const ticketRows = await ctx.db
          .select({
            id: orders.id,
            eventId: events.id,
            eventName: events.title,
            category: sql<string | null>`null`,
            date: orders.paidAt,
            createdAt: orders.createdAt,
            tier: ticketTiers.name,
            qty: orders.quantity,
            amount: orders.totalMinor,
            thumbnailUrl: events.bannerUrl,
          })
          .from(orders)
          .innerJoin(events, eq(orders.eventId, events.id))
          .innerJoin(ticketTiers, eq(orders.tierId, ticketTiers.id))
          .where(
            and(
              eq(orders.status, 'paid'),
              or(eq(orders.buyerId, u.id), eq(orders.buyerEmail, u.email))!
            )
          )
          .orderBy(desc(orders.createdAt))
          .limit(50)

        return {
          ...base,
          role: 'attendee' as const,
          eventsAttended: ticketRows.length,
          ticketHistory: ticketRows.map((r) => ({
            id: r.id,
            eventId: r.eventId,
            eventName: r.eventName,
            category: r.category ?? '',
            date: (r.date ?? r.createdAt).toISOString(),
            tier: r.tier,
            qty: r.qty,
            amount: r.amount,
            thumbnailUrl: r.thumbnailUrl ?? '',
          })),
        }
      }

      if (role === 'organizer') {
        const eventRows = await ctx.db
          .select({
            id: events.id,
            title: events.title,
            status: events.status,
            eventDate: events.eventDate,
            bannerUrl: events.bannerUrl,
            sold: sql<number>`coalesce(sum(${ticketTiers.sold}), 0)`,
            total: sql<number>`coalesce(sum(${ticketTiers.quantity}), 0)`,
            revenue: sql<number>`coalesce(sum(${ticketTiers.sold} * ${ticketTiers.priceMinor}), 0)`,
          })
          .from(events)
          .leftJoin(ticketTiers, eq(ticketTiers.eventId, events.id))
          .where(eq(events.organizerId, u.id))
          .groupBy(events.id)
          .orderBy(desc(events.createdAt))
          .limit(50)

        const totals = eventRows.reduce(
          (acc, r) => {
            acc.totalSold += Number(r.sold)
            acc.totalRevenue += Number(r.revenue)
            if (r.status === 'upcoming') acc.activeCount++
            else if (r.status === 'archived') acc.archivedCount++
            return acc
          },
          { totalSold: 0, totalRevenue: 0, activeCount: 0, archivedCount: 0 }
        )

        return {
          ...base,
          role: 'organizer' as const,
          logoUrl: u.image ?? null,
          totalEvents: eventRows.length,
          activeCount: totals.activeCount,
          archivedCount: totals.archivedCount,
          flaggedCount: 0,
          totalSold: totals.totalSold,
          totalRevenue: totals.totalRevenue,
          events: eventRows.map((r) => ({
            id: r.id,
            eventName: r.title,
            eventId: r.id,
            category: '',
            date: r.eventDate,
            sold: Number(r.sold),
            total: Number(r.total),
            status: ((r.status === 'upcoming' || r.status === 'archived'
              ? r.status
              : 'flagged') === 'upcoming'
              ? 'active'
              : r.status === 'archived'
                ? 'archived'
                : 'flagged') as 'active' | 'archived' | 'flagged',
            revenue: Number(r.revenue),
            thumbnailUrl: r.bannerUrl ?? '',
          })),
        }
      }

      // vendor
      const historyRows = await ctx.db
        .select({
          id: eventVendors.id,
          eventId: events.id,
          eventName: events.title,
          eventDate: events.eventDate,
          status: events.status,
          bannerUrl: events.bannerUrl,
        })
        .from(eventVendors)
        .innerJoin(events, eq(eventVendors.eventId, events.id))
        .where(eq(eventVendors.vendorId, u.id))
        .orderBy(desc(events.eventDate))
        .limit(50)

      return {
        ...base,
        role: 'vendor' as const,
        logoUrl: u.image ?? null,
        category: u.businessCategory ?? '',
        description: u.businessDescription ?? '',
        eventsParticipated: historyRows.length,
        verified: u.vendorApprovalStatus === 'approved',
        showcase: (u.vendorShowcaseImages ?? []) as string[],
        instagramUrl: u.vendorInstagramUrl ?? null,
        websiteUrl: u.vendorWebsiteUrl ?? null,
        history: historyRows.map((r) => ({
          id: r.id,
          eventId: r.eventId,
          eventName: r.eventName,
          category: '',
          date: r.eventDate,
          status:
            r.status === 'upcoming'
              ? ('upcoming' as const)
              : ('archived' as const),
          thumbnailUrl: r.bannerUrl ?? '',
        })),
      }
    }),

  suspend: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        reason: z.string().default(''),
        days: z.number().int().min(1).max(365).default(30),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const target = await findActionTarget(
        ctx.db,
        ctx.session.user.id,
        input.id
      )

      const expiresAt = addDays(new Date(), input.days)

      await ctx.db
        .update(user)
        .set({
          banned: true,
          banReason: input.reason || null,
          banExpires: expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(user.id, target.id))

      // Kill any open sessions immediately so the user is signed out.
      await ctx.db.delete(session).where(eq(session.userId, target.id))

      void tasks.trigger('send-account-suspended', {
        email: target.email,
        name: target.name,
        reason: input.reason,
        expiresAt: format(expiresAt, 'MMMM d, yyyy'),
      })

      return { ok: true as const }
    }),

  disable: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        reason: z.string().default(''),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const target = await findActionTarget(
        ctx.db,
        ctx.session.user.id,
        input.id
      )

      await ctx.db
        .update(user)
        .set({
          banned: true,
          banReason: input.reason || null,
          banExpires: null,
          updatedAt: new Date(),
        })
        .where(eq(user.id, target.id))

      await ctx.db.delete(session).where(eq(session.userId, target.id))

      void tasks.trigger('send-account-disabled', {
        email: target.email,
        name: target.name,
        reason: input.reason,
      })

      return { ok: true as const }
    }),

  reactivate: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const target = await findActionTarget(
        ctx.db,
        ctx.session.user.id,
        input.id
      )

      await ctx.db
        .update(user)
        .set({
          banned: false,
          banReason: null,
          banExpires: null,
          updatedAt: new Date(),
        })
        .where(eq(user.id, target.id))

      void tasks.trigger('send-account-reactivated', {
        email: target.email,
        name: target.name,
      })

      return { ok: true as const }
    }),

  remove: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const target = await findActionTarget(
        ctx.db,
        ctx.session.user.id,
        input.id
      )

      // Notify before deletion since the row is about to disappear. Sessions
      // and dependent rows cascade off the user FK.
      void tasks.trigger('send-account-removed', {
        email: target.email,
        name: target.name,
      })

      await ctx.db.delete(user).where(eq(user.id, target.id))

      return { ok: true as const }
    }),
})
