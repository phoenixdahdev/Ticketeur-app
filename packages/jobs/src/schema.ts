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
