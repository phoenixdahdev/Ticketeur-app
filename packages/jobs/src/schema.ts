import { z } from 'zod'

export const verificationOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
  type: z
    .enum(['email-verification', 'sign-in', 'forget-password'])
    .default('email-verification'),
})

export const passwordResetSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  resetUrl: z.string().url(),
})

export const twoFactorOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
})

export const welcomeEmailSchema = z.object({
  email: z.string().email(),
  name: z.string(),
})

export type VerificationOtpPayload = z.infer<typeof verificationOtpSchema>
export type PasswordResetPayload = z.infer<typeof passwordResetSchema>
export type TwoFactorOtpPayload = z.infer<typeof twoFactorOtpSchema>
export type WelcomeEmailPayload = z.infer<typeof welcomeEmailSchema>
