import { z } from 'zod'

export const WaitlistJoinedPayloadSchema = z.object({
  email: z.email(),
  name: z.string(),
})

export const VerificationEmailPayloadSchema = z.object({
  email: z.email(),
  otp: z.string(),
  name: z.string(),
})

export const OnboardingSubmittedPayloadSchema = z.object({
  email: z.email(),
  firstName: z.string(),
})

export const OnboardingAcceptedPayloadSchema = z.object({
  email: z.email(),
  firstName: z.string(),
  dashboardUrl: z.string().optional(),
})

export const OnboardingDeclinedPayloadSchema = z.object({
  email: z.email(),
  firstName: z.string(),
  reason: z.string().optional(),
  supportUrl: z.string().optional(),
})
