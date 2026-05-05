import { and, asc, desc, eq, ilike, sql } from 'drizzle-orm'
import { z } from 'zod'

import { events, eventVendors, user } from '@ticketur/db'

import { createTRPCRouter, publicProcedure } from '../../trpc'

// A user is hidden from public surfaces only while an active ban applies.
// Permanent bans (banExpires is null) and unexpired temp bans both hide;
// already-expired temp bans fall through so vendors reappear automatically
// without waiting for them to sign in (Better Auth lazily clears those on
// the next session.create.before hook).
const notCurrentlyBanned = sql`(${user.banned} IS NOT TRUE OR (${user.banExpires} IS NOT NULL AND ${user.banExpires} < NOW()))`

const listInput = z.object({
  q: z.string().default(''),
  category: z.string().default('all'),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(12),
})

export const publicVendorsRouter = createTRPCRouter({
  // Approved vendors only.
  list: publicProcedure.input(listInput).query(async ({ ctx, input }) => {
    const filters = [
      eq(user.role, 'vendor'),
      eq(user.vendorApprovalStatus, 'approved'),
      notCurrentlyBanned,
    ]
    if (input.q.trim().length > 0) {
      filters.push(ilike(user.businessName, `%${input.q.trim()}%`))
    }
    if (input.category !== 'all') {
      filters.push(eq(user.businessCategory, input.category))
    }

    const rows = await ctx.db
      .select({
        id: user.id,
        businessName: user.businessName,
        businessCategory: user.businessCategory,
        businessDescription: user.businessDescription,
        tagline: user.vendorTagline,
        location: user.vendorLocation,
        image: user.image,
        bannerUrl: user.vendorBannerUrl,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(and(...filters))
      .orderBy(asc(user.businessName))
      .limit(input.pageSize)
      .offset((input.page - 1) * input.pageSize)

    const totalCountRows = await ctx.db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(user)
      .where(and(...filters))

    return {
      rows,
      total: totalCountRows[0]?.count ?? 0,
      page: input.page,
      pageSize: input.pageSize,
    }
  }),

  featured: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: user.id,
        businessName: user.businessName,
        businessCategory: user.businessCategory,
        businessDescription: user.businessDescription,
        tagline: user.vendorTagline,
        image: user.image,
      })
      .from(user)
      .where(
        and(
          eq(user.role, 'vendor'),
          eq(user.vendorApprovalStatus, 'approved'),
          notCurrentlyBanned
        )
      )
      .orderBy(desc(user.createdAt))
      .limit(4)

    return rows
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const found = await ctx.db
        .select({
          id: user.id,
          businessName: user.businessName,
          businessCategory: user.businessCategory,
          businessDescription: user.businessDescription,
          tagline: user.vendorTagline,
          location: user.vendorLocation,
          image: user.image,
          bannerUrl: user.vendorBannerUrl,
          instagramUrl: user.vendorInstagramUrl,
          websiteUrl: user.vendorWebsiteUrl,
          expertise: user.vendorExpertise,
          focus: user.vendorFocus,
          experience: user.vendorExperience,
          showcaseImages: user.vendorShowcaseImages,
          createdAt: user.createdAt,
        })
        .from(user)
        .where(
          and(
            eq(user.id, input.id),
            eq(user.role, 'vendor'),
            eq(user.vendorApprovalStatus, 'approved'),
            notCurrentlyBanned
          )
        )
        .limit(1)

      const vendor = found[0]
      if (!vendor) return null

      const hostedRows = await ctx.db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(eventVendors)
        .where(eq(eventVendors.vendorId, vendor.id))

      const today = new Date().toISOString().slice(0, 10)
      const participating = await ctx.db
        .select({
          id: events.id,
          title: events.title,
          eventDate: events.eventDate,
          endDate: events.endDate,
          eventTime: events.eventTime,
          location: events.location,
          bannerUrl: events.bannerUrl,
          status: events.status,
        })
        .from(eventVendors)
        .innerJoin(events, eq(events.id, eventVendors.eventId))
        .where(
          and(
            eq(eventVendors.vendorId, vendor.id),
            eq(events.status, 'upcoming')
          )
        )
        .orderBy(asc(events.eventDate))
        .limit(6)

      return {
        ...vendor,
        hostedEvents: hostedRows[0]?.count ?? 0,
        partnerSince: vendor.createdAt.getFullYear(),
        participatingEvents: participating,
        // Today is intentionally returned so the client doesn't have to
        // recompute timezone-sensitive comparisons.
        today,
      }
    }),
})

export type PublicVendorsRouter = typeof publicVendorsRouter
