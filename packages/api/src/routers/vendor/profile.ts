import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { user } from '@ticketur/db'

import { createTRPCRouter, vendorProcedure } from '../../trpc'

const optionalUrl = z
  .string()
  .trim()
  .url('Enter a valid URL')
  .or(z.literal(''))
  .optional()

const profileInput = z.object({
  businessName: z.string().trim().min(1),
  businessLocation: z.string().trim().min(1),
  businessCategory: z.string().trim().min(1),
  tagline: z.string().trim().max(160),
  businessDescription: z.string().trim().max(2000),
  instagramUrl: optionalUrl,
  websiteUrl: optionalUrl,
  logoUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  expertise: z.string().trim().max(60),
  focus: z.string().trim().max(60),
  experience: z.string().trim().max(60),
  showcaseImages: z.array(z.string()).max(12).default([]),
})

export const vendorProfileRouter = createTRPCRouter({
  get: vendorProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        businessName: user.businessName,
        businessLocation: user.vendorLocation,
        businessCategory: user.businessCategory,
        businessDescription: user.businessDescription,
        tagline: user.vendorTagline,
        instagramUrl: user.vendorInstagramUrl,
        websiteUrl: user.vendorWebsiteUrl,
        bannerUrl: user.vendorBannerUrl,
        expertise: user.vendorExpertise,
        focus: user.vendorFocus,
        experience: user.vendorExperience,
        showcaseImages: user.vendorShowcaseImages,
        approvalStatus: user.vendorApprovalStatus,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, ctx.session.user.id))
      .limit(1)

    return rows[0] ?? null
  }),

  update: vendorProcedure
    .input(profileInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(user)
        .set({
          businessName: input.businessName,
          vendorLocation: input.businessLocation,
          businessCategory: input.businessCategory,
          businessDescription: input.businessDescription,
          vendorTagline: input.tagline,
          vendorInstagramUrl: input.instagramUrl ?? null,
          vendorWebsiteUrl: input.websiteUrl ?? null,
          image: input.logoUrl ?? null,
          vendorBannerUrl: input.bannerUrl ?? null,
          vendorExpertise: input.expertise,
          vendorFocus: input.focus,
          vendorExperience: input.experience,
          vendorShowcaseImages: input.showcaseImages,
          updatedAt: new Date(),
        })
        .where(eq(user.id, ctx.session.user.id))

      return { ok: true }
    }),
})

export type VendorProfileRouter = typeof vendorProfileRouter
