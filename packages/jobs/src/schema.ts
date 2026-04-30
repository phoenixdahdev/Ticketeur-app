import { z } from 'zod'

export const verificationOtpSchema = z.object({
  email: z.email(),
  otp: z.string(),
  type: z
    .enum(['email-verification', 'sign-in', 'forget-password'])
    .default('email-verification'),
})

export const passwordResetSchema = z.object({
  email: z.email(),
  name: z.string(),
  resetUrl: z.url(),
})

export const twoFactorOtpSchema = z.object({
  email: z.email(),
  otp: z.string(),
})

export const welcomeEmailSchema = z.object({
  email: z.email(),
  name: z.string(),
})

export const vendorInviteSchema = z.object({
  email: z.email(),
  businessName: z.string(),
  contactName: z.string(),
  organizerName: z.string(),
  eventTitle: z.string(),
  signupUrl: z.url(),
})

export const eventApprovedSchema = z.object({
  email: z.email(),
  organizerName: z.string(),
  eventTitle: z.string(),
  eventDate: z.string(),
  eventLocation: z.string(),
  publicUrl: z.url(),
  manageUrl: z.url(),
})

export const ticketConfirmationSchema = z.object({
  email: z.email(),
  firstName: z.string(),
  eventTitle: z.string(),
  eventDate: z.string(),
  eventTime: z.string(),
  eventLocation: z.string(),
  ticketTier: z.string(),
  quantity: z.number().int().min(1),
  ticketsUrl: z.url(),
  // Optional PDF attachment fetched at send time. URL must be public.
  pdfUrl: z.url().optional(),
  pdfFilename: z.string().optional(),
})

export type VerificationOtpPayload = z.infer<typeof verificationOtpSchema>
export type PasswordResetPayload = z.infer<typeof passwordResetSchema>
export type TwoFactorOtpPayload = z.infer<typeof twoFactorOtpSchema>
export type WelcomeEmailPayload = z.infer<typeof welcomeEmailSchema>
export type VendorInvitePayload = z.infer<typeof vendorInviteSchema>
export type EventApprovedPayload = z.infer<typeof eventApprovedSchema>
export type TicketConfirmationPayload = z.infer<typeof ticketConfirmationSchema>
