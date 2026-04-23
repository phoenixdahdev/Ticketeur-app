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

export type VerificationOtpPayload = z.infer<typeof verificationOtpSchema>
export type PasswordResetPayload = z.infer<typeof passwordResetSchema>
export type TwoFactorOtpPayload = z.infer<typeof twoFactorOtpSchema>
