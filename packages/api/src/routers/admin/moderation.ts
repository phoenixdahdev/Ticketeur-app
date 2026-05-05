import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import {
  and,
  count,
  desc,
  eq,
  ne,
  sql,
} from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { tasks } from '@trigger.dev/sdk'
import { addDays, format } from 'date-fns'

import {
  events,
  eventVendors,
  reports,
  session,
  ticketTiers,
  user,
  type ReportSubjectType,
} from '@ticketur/db'

import { adminProcedure, createTRPCRouter } from '../../trpc'

const NOT_ADMIN = ne(user.role, 'admin')
const VENDOR_PENDING = and(
  eq(user.role, 'vendor'),
  eq(user.vendorApprovalStatus, 'pending')
)
const EVENT_PENDING = eq(events.status, 'in-review')
const REPORT_OPEN = eq(reports.status, 'open')

const PUBLIC_BASE = 'https://www.useticketeur.com'

// Pre-formatted date string for emails. Single-day → "MMMM d, yyyy".
// Multi-day → "MMMM d, yyyy – MMMM d, yyyy".
function formatRange(start: string, end: string | null) {
  const startDate = new Date(`${start}T00:00:00`)
  if (Number.isNaN(startDate.getTime())) return start
  const startStr = format(startDate, 'MMMM d, yyyy')
  if (!end || end === start) return startStr
  const endDate = new Date(`${end}T00:00:00`)
  if (Number.isNaN(endDate.getTime())) return startStr
  return `${startStr} – ${format(endDate, 'MMMM d, yyyy')}`
}

export const adminModerationRouter = createTRPCRouter({
  stats: adminProcedure.query(async ({ ctx }) => {
    const [vendorRow] = await ctx.db
      .select({ value: count(user.id) })
      .from(user)
      .where(VENDOR_PENDING)
    const [eventRow] = await ctx.db
      .select({ value: count(events.id) })
      .from(events)
      .where(EVENT_PENDING)
    const [reportRow] = await ctx.db
      .select({ value: count(reports.id) })
      .from(reports)
      .where(REPORT_OPEN)

    return {
      vendors: Number(vendorRow?.value ?? 0),
      events: Number(eventRow?.value ?? 0),
      flagged: Number(reportRow?.value ?? 0),
    }
  }),

  pendingVendors: adminProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        category: user.businessCategory,
        image: user.image,
        instagramUrl: user.vendorInstagramUrl,
        websiteUrl: user.vendorWebsiteUrl,
        registeredAt: user.createdAt,
      })
      .from(user)
      .where(VENDOR_PENDING)
      .orderBy(desc(user.createdAt))

    return rows.map((r) => ({
      id: r.id,
      name: r.businessName ?? r.name,
      contactName: r.name,
      email: r.email,
      category: r.category ?? '',
      logoUrl: r.image ?? null,
      instagramUrl: r.instagramUrl ?? null,
      websiteUrl: r.websiteUrl ?? null,
      registeredAt: r.registeredAt.toISOString(),
    }))
  }),

  pendingEvents: adminProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: events.id,
        title: events.title,
        bannerUrl: events.bannerUrl,
        registeredAt: events.createdAt,
        organizerId: user.id,
        organizerName: user.name,
        organizerOrgName: user.orgName,
      })
      .from(events)
      .innerJoin(user, eq(events.organizerId, user.id))
      .where(EVENT_PENDING)
      .orderBy(desc(events.createdAt))

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      // Events don't carry a category column today.
      category: '',
      thumbnailUrl: r.bannerUrl ?? '',
      organizerName: r.organizerOrgName ?? r.organizerName,
      registeredAt: r.registeredAt.toISOString(),
    }))
  }),

  // Top 5 pending items mixed across vendor approvals, event approvals,
  // and open reports. Used by the overview page.
  queue: adminProcedure.query(async ({ ctx }) => {
    const [vendorRows, eventRows, reportRows] = await Promise.all([
      ctx.db
        .select({
          id: user.id,
          name: user.name,
          businessName: user.businessName,
          image: user.image,
          createdAt: user.createdAt,
        })
        .from(user)
        .where(VENDOR_PENDING)
        .orderBy(desc(user.createdAt))
        .limit(5),
      ctx.db
        .select({
          id: events.id,
          title: events.title,
          bannerUrl: events.bannerUrl,
          createdAt: events.createdAt,
        })
        .from(events)
        .where(EVENT_PENDING)
        .orderBy(desc(events.createdAt))
        .limit(5),
      ctx.db
        .select()
        .from(reports)
        .where(REPORT_OPEN)
        .orderBy(desc(reports.createdAt))
        .limit(5),
    ])

    type Item = {
      kind: 'vendor' | 'event' | 'report'
      // Routing target for the row's view button.
      href: string
      // ID of the underlying record (used for approve/reject mutations).
      id: string
      title: string
      reasonLabel: string
      reasonValue: string
      imageUrl: string | null
      timestamp: string
    }

    const items: Item[] = [
      ...vendorRows.map(
        (v): Item => ({
          kind: 'vendor',
          href: `/moderation/vendor/${v.id}`,
          id: v.id,
          title: v.businessName ?? v.name,
          reasonLabel: 'Request:',
          reasonValue: 'Vendor Approval',
          imageUrl: v.image ?? null,
          timestamp: v.createdAt.toISOString(),
        })
      ),
      ...eventRows.map(
        (e): Item => ({
          kind: 'event',
          href: `/moderation/event/${e.id}`,
          id: e.id,
          title: e.title,
          reasonLabel: 'Request:',
          reasonValue: 'Event Approval',
          imageUrl: e.bannerUrl ?? null,
          timestamp: e.createdAt.toISOString(),
        })
      ),
      ...reportRows.map(
        (r): Item => ({
          kind: 'report',
          href: '/moderation?tab=flagged',
          id: r.id,
          title: r.reason,
          reasonLabel: 'Flagged for:',
          reasonValue: r.detail || r.reason,
          imageUrl: null,
          timestamp: r.createdAt.toISOString(),
        })
      ),
    ]

    items.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    return items.slice(0, 5)
  }),

  flaggedActivities: adminProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(reports)
      .where(REPORT_OPEN)
      .orderBy(desc(reports.createdAt))

    return rows.map((r) => ({
      id: r.id,
      subjectType: r.subjectType as ReportSubjectType,
      subjectId: r.subjectId,
      reason: r.reason,
      detail: r.detail,
      date: r.createdAt.toISOString(),
    }))
  }),

  vendorById: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select()
        .from(user)
        .where(and(eq(user.id, input.id), eq(user.role, 'vendor')))
        .limit(1)

      if (!row) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vendor not found',
        })
      }

      return {
        id: row.id,
        name: row.businessName ?? row.name,
        contactName: row.name,
        email: row.email,
        category: row.businessCategory ?? '',
        logoUrl: row.image ?? null,
        instagramUrl: row.vendorInstagramUrl ?? null,
        websiteUrl: row.vendorWebsiteUrl ?? null,
        description: row.businessDescription ?? '',
        showcase: (row.vendorShowcaseImages ?? []) as string[],
        registeredAt: row.createdAt.toISOString(),
        approvalStatus: (row.vendorApprovalStatus ?? null) as
          | 'pending'
          | 'approved'
          | 'rejected'
          | null,
      }
    }),

  eventById: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const [ev] = await ctx.db
        .select()
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1)

      if (!ev) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        })
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
        })
        .from(user)
        .where(eq(user.id, ev.organizerId))
        .limit(1)

      const tierRows = await ctx.db
        .select()
        .from(ticketTiers)
        .where(eq(ticketTiers.eventId, ev.id))

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
        .where(eq(eventVendors.eventId, ev.id))

      return {
        id: ev.id,
        title: ev.title,
        description: ev.description,
        bannerUrl: ev.bannerUrl ?? '',
        eventDate: ev.eventDate,
        endDate: ev.endDate,
        eventTime: ev.eventTime,
        location: ev.location,
        features: (ev.features ?? []) as string[],
        status: ev.status,
        registeredAt: ev.createdAt.toISOString(),
        organizer: organizer
          ? {
              id: organizer.id,
              name: organizer.orgName ?? organizer.name,
              email: organizer.email,
              image: organizer.image ?? null,
              joinedAt: organizer.createdAt.toISOString(),
              status: (organizer.banned ? 'suspended' : 'active') as
                | 'active'
                | 'suspended',
            }
          : null,
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

  approveVendor: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [target] = await ctx.db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
        })
        .from(user)
        .where(
          and(
            eq(user.id, input.id),
            eq(user.role, 'vendor'),
            NOT_ADMIN
          )
        )
        .limit(1)

      if (!target) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Vendor not found' })
      }

      await ctx.db
        .update(user)
        .set({
          vendorApprovalStatus: 'approved',
          updatedAt: new Date(),
        })
        .where(eq(user.id, target.id))

      void tasks.trigger('send-vendor-approved', {
        email: target.email,
        vendorName: target.name,
        businessName: target.businessName ?? target.name,
        profileUrl: `${PUBLIC_BASE}/vendors/${target.id}`,
      })

      return { ok: true as const }
    }),

  rejectVendor: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        reason: z.string().default(''),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [target] = await ctx.db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
        })
        .from(user)
        .where(
          and(
            eq(user.id, input.id),
            eq(user.role, 'vendor'),
            NOT_ADMIN
          )
        )
        .limit(1)

      if (!target) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Vendor not found' })
      }

      await ctx.db
        .update(user)
        .set({
          vendorApprovalStatus: 'rejected',
          updatedAt: new Date(),
        })
        .where(eq(user.id, target.id))

      void tasks.trigger('send-vendor-rejected', {
        email: target.email,
        vendorName: target.name,
        businessName: target.businessName ?? target.name,
        reason: input.reason,
      })

      return { ok: true as const }
    }),

  approveEvent: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [ev] = await ctx.db
        .select({
          id: events.id,
          title: events.title,
          eventDate: events.eventDate,
          endDate: events.endDate,
          location: events.location,
          organizerId: events.organizerId,
        })
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1)

      if (!ev) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      }

      const [organizer] = await ctx.db
        .select({
          name: user.name,
          orgName: user.orgName,
          email: user.email,
        })
        .from(user)
        .where(eq(user.id, ev.organizerId))
        .limit(1)

      await ctx.db
        .update(events)
        .set({ status: 'upcoming', updatedAt: new Date() })
        .where(eq(events.id, ev.id))

      if (organizer) {
        void tasks.trigger('send-event-approved', {
          email: organizer.email,
          organizerName: organizer.orgName ?? organizer.name,
          eventTitle: ev.title,
          eventDate: formatRange(ev.eventDate, ev.endDate),
          eventLocation: ev.location,
          publicUrl: `${PUBLIC_BASE}/events/${ev.id}`,
          manageUrl: `${PUBLIC_BASE}/org/events/${ev.id}`,
        })
      }

      return { ok: true as const }
    }),

  rejectEvent: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        reason: z.string().default(''),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [ev] = await ctx.db
        .select({
          id: events.id,
          title: events.title,
          organizerId: events.organizerId,
        })
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1)

      if (!ev) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      }

      const [organizer] = await ctx.db
        .select({
          name: user.name,
          orgName: user.orgName,
          email: user.email,
        })
        .from(user)
        .where(eq(user.id, ev.organizerId))
        .limit(1)

      // Move back to draft so the organizer can edit + resubmit.
      await ctx.db
        .update(events)
        .set({ status: 'draft', updatedAt: new Date() })
        .where(eq(events.id, ev.id))

      if (organizer) {
        void tasks.trigger('send-event-rejected', {
          email: organizer.email,
          organizerName: organizer.orgName ?? organizer.name,
          eventTitle: ev.title,
          reason: input.reason,
        })
      }

      return { ok: true as const }
    }),

  dismissFlag: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [r] = await ctx.db
        .select({ id: reports.id })
        .from(reports)
        .where(eq(reports.id, input.id))
        .limit(1)
      if (!r) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Report not found' })
      }
      await ctx.db
        .update(reports)
        .set({ status: 'dismissed', resolvedAt: new Date() })
        .where(eq(reports.id, input.id))

      return { ok: true as const }
    }),

  // Suspends the subject of an open report and marks the report actioned.
  // Reuses send-account-suspended so the user gets the same template the
  // /users page sends.
  suspendFromFlag: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        reason: z.string().default(''),
        days: z.number().int().min(1).max(365).default(30),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [r] = await ctx.db
        .select()
        .from(reports)
        .where(and(eq(reports.id, input.id), REPORT_OPEN))
        .limit(1)
      if (!r) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Report not found' })
      }

      // Only user-typed subjects can be suspended through this flow; for
      // event reports the admin should approve/reject the event instead.
      if (r.subjectType === 'event') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Suspend the organizer or use event approval instead.',
        })
      }

      const [target] = await ctx.db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })
        .from(user)
        .where(and(eq(user.id, r.subjectId), NOT_ADMIN))
        .limit(1)

      if (!target) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Reported user not found',
        })
      }

      const expiresAt = addDays(new Date(), input.days)

      await ctx.db
        .update(user)
        .set({
          banned: true,
          banReason: input.reason || r.reason,
          banExpires: expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(user.id, target.id))

      await ctx.db.delete(session).where(eq(session.userId, target.id))

      await ctx.db
        .update(reports)
        .set({ status: 'actioned', resolvedAt: new Date() })
        .where(eq(reports.id, input.id))

      void tasks.trigger('send-account-suspended', {
        email: target.email,
        name: target.name,
        reason: input.reason || r.reason,
        // Pre-formatted for the worker (it doesn't import date-fns).
        expiresAt: expiresAt.toISOString().slice(0, 10),
      })

      return { ok: true as const }
    }),
})

// Silences "imported but unused" when randomUUID is not yet wired.
void randomUUID
