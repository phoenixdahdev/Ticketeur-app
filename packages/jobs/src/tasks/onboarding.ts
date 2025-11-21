import {
  OnboardingSubmittedPayloadSchema,
  OnboardingAcceptedPayloadSchema,
  OnboardingDeclinedPayloadSchema,
  OnboardingResponseAdminPayloadSchema,
} from '@jobs/schema'
import { nanoid } from 'nanoid'
import { resend } from '@jobs/utils/resend'
import { render } from '@react-email/render'
import { schemaTask } from '@trigger.dev/sdk'
import OnboardingSubmittedEmail from '@useticketeur/email/emails/onboarding-submitted'
import OnboardingAcceptedEmail from '@useticketeur/email/emails/onboarding-accepted'
import OnboardingDeclinedEmail from '@useticketeur/email/emails/onboarding-declined'
import OnboardingResponseEmail from '@useticketeur/email/emails/onboarding-response-email'

export const sendOnboardingSubmittedEmail: unknown = schemaTask({
  id: 'send-onboarding-submitted-email',
  schema: OnboardingSubmittedPayloadSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async ({ email, firstName }) => {
    const html = await render(OnboardingSubmittedEmail({ firstName }))
    const { data, error } = await resend.emails.send({
      headers: {
        'X-Entity-Ref-ID': nanoid(),
      },
      from: 'Ticketeur <noreply@useticketeur.com>',
      to: [email],
      subject: 'Onboarding Documents Received - Ticketeur',
      html,
    })

    if (error) {
      throw error
    }
    return { success: true, data }
  },
})

export const sendOnboardingAcceptedEmail: unknown = schemaTask({
  id: 'send-onboarding-accepted-email',
  schema: OnboardingAcceptedPayloadSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async ({ email, firstName, dashboardUrl }) => {
    const html = await render(
      OnboardingAcceptedEmail({ firstName, dashboardUrl })
    )
    const { data, error } = await resend.emails.send({
      headers: {
        'X-Entity-Ref-ID': nanoid(),
      },
      from: 'Ticketeur <noreply@useticketeur.com>',
      to: [email],
      subject: 'Welcome to Ticketeur - Your Account is Approved!',
      html,
    })

    if (error) {
      throw error
    }
    return { success: true, data }
  },
})

export const sendOnboardingDeclinedEmail: unknown = schemaTask({
  id: 'send-onboarding-declined-email',
  schema: OnboardingDeclinedPayloadSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async ({ email, firstName, reason, supportUrl }) => {
    const html = await render(
      OnboardingDeclinedEmail({ firstName, reason, supportUrl })
    )
    const { data, error } = await resend.emails.send({
      headers: {
        'X-Entity-Ref-ID': nanoid(),
      },
      from: 'Ticketeur <noreply@useticketeur.com>',
      to: [email],
      subject: 'Action Required: Your Ticketeur Application',
      html,
    })

    if (error) {
      throw error
    }
    return { success: true, data }
  },
})

export const sendOnboardingResponseAdminEmail: unknown = schemaTask({
  id: 'send-onboarding-response-admin-email',
  schema: OnboardingResponseAdminPayloadSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async ({ adminEmail, userName, userEmail, userId, documents, verificationUrl }) => {
    const html = await render(
      OnboardingResponseEmail({ userName, userEmail, userId, documents, verificationUrl })
    )
    const { data, error } = await resend.emails.send({
      headers: {
        'X-Entity-Ref-ID': nanoid(),
      },
      from: 'Ticketeur <noreply@useticketeur.com>',
      to: [adminEmail],
      subject: `New Onboarding Response from ${userName}`,
      html,
    })

    if (error) {
      throw error
    }
    return { success: true, data }
  },
})
