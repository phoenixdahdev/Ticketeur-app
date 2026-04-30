import { z } from 'zod'

export const VENDOR_BUSINESS_CATEGORIES = [
  'Food & Drink',
  'Apparel',
  'Beverages',
  'Decor',
  'Entertainment',
  'Merchandise',
  'Photography',
  'Lighting',
  'Other',
] as const

const optionalUrl = z
  .string()
  .trim()
  .url('Enter a valid URL')
  .or(z.literal(''))
  .optional()

export const vendorProfileSchema = z.object({
  businessName: z.string().trim().min(1, 'Business name required'),
  businessLocation: z.string().trim().min(1, 'Location required'),
  businessCategory: z.string().trim().min(1, 'Category required'),
  // Short tagline shown on the public vendor hero card (max ~160 chars).
  tagline: z
    .string()
    .trim()
    .max(160, 'Keep your tagline under 160 characters'),
  businessDescription: z
    .string()
    .trim()
    .max(2000, 'Keep your description under 2000 characters'),
  instagramUrl: optionalUrl,
  websiteUrl: optionalUrl,
  logoUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  // Surfaced on public page as the three highlight stats.
  expertise: z.string().trim().max(60, 'Keep it under 60 characters'),
  focus: z.string().trim().max(60, 'Keep it under 60 characters'),
  experience: z.string().trim().max(60, 'Keep it under 60 characters'),
  showcaseImages: z.array(z.string()).max(12),
})

export type VendorProfileValues = z.infer<typeof vendorProfileSchema>

export const VENDOR_PROFILE_DEFAULTS: VendorProfileValues = {
  businessName: '',
  businessLocation: '',
  businessCategory: '',
  tagline: '',
  businessDescription: '',
  instagramUrl: '',
  websiteUrl: '',
  logoUrl: null,
  bannerUrl: null,
  expertise: '',
  focus: '',
  experience: '',
  showcaseImages: [],
}
