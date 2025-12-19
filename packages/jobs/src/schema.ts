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

export const OnboardingResponseAdminPayloadSchema = z.object({
  adminEmail: z.email(),
  userName: z.string(),
  userEmail: z.email(),
  userId: z.string(),
  documents: z.array(z.string()),
  verificationUrl: z.string(),
})

export const EventInvitationPayloadSchema = z.object({
  email: z.email(),
  inviteeName: z.string().optional(),
  inviterName: z.string(),
  eventName: z.string(),
  eventDate: z.string().optional(),
  role: z.string(),
  acceptUrl: z.string(),
  declineUrl: z.string(),
})

export const EventApprovalRequestPayloadSchema = z.object({
  adminEmail: z.email(),
  eventId: z.string(),
  eventName: z.string(),
  eventDate: z.string().optional(),
  organizerName: z.string(),
  organizerEmail: z.email(),
  eventDescription: z.string().optional(),
  approvalUrl: z.string(),
})

export const EventApprovedPayloadSchema = z.object({
  email: z.email(),
  firstName: z.string(),
  eventTitle: z.string(),
  eventId: z.string(),
})

export const EventDeclinedPayloadSchema = z.object({
  email: z.email(),
  firstName: z.string(),
  eventTitle: z.string(),
  eventId: z.string(),
  reason: z.string(),
})
