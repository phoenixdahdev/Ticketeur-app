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

export const vendorProfileSchema = z.object({
  businessName: z.string().trim().min(1, 'Business name required'),
  businessLocation: z.string().trim().min(1, 'Location required'),
  businessCategory: z
    .string()
    .trim()
    .min(1, 'Category required'),
  businessDescription: z
    .string()
    .trim()
    .max(500, 'Keep your description under 500 characters'),
  instagramUrl: z
    .string()
    .trim()
    .url('Enter a valid URL')
    .or(z.literal(''))
    .optional(),
  websiteUrl: z
    .string()
    .trim()
    .url('Enter a valid URL')
    .or(z.literal(''))
    .optional(),
  logoUrl: z.string().nullable().optional(),
  showcaseImages: z.array(z.string()).max(12),
})

export type VendorProfileValues = z.infer<typeof vendorProfileSchema>

export const VENDOR_PROFILE_DEFAULTS: VendorProfileValues = {
  businessName: '',
  businessLocation: '',
  businessCategory: '',
  businessDescription: '',
  instagramUrl: '',
  websiteUrl: '',
  logoUrl: null,
  showcaseImages: [],
}
