import { nanoid } from 'nanoid'
import { resend } from '@jobs/utils/resend'
import { render } from '@react-email/render'
import { schemaTask } from '@trigger.dev/sdk'
import {
  EventApprovalRequestPayloadSchema,
  EventApprovedPayloadSchema,
  EventDeclinedPayloadSchema
} from '@jobs/schema'
import EventApprovalRequestEmail from '@useticketeur/email/emails/event-approval-request'
import EventApprovedEmail from '@useticketeur/email/emails/event-approved'
import EventDeclinedEmail from '@useticketeur/email/emails/event-declined'

export const sendEventApprovalRequestEmail: unknown = schemaTask({
  id: 'send-event-approval-request-email',
  schema: EventApprovalRequestPayloadSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async ({
    adminEmail,
    eventName,
    eventDate,
    organizerName,
    organizerEmail,
    eventDescription,
    approvalUrl,
  }) => {
    const html = await render(
      EventApprovalRequestEmail({
        eventName,
        eventDate,
        organizerName,
        organizerEmail,
        eventDescription,
        approvalUrl,
      })
    )

    const { data, error } = await resend.emails.send({
      headers: {
        'X-Entity-Ref-ID': nanoid(),
      },
      from: 'Ticketeur <noreply@useticketeur.com>',
      to: [adminEmail],
      subject: `New Event Awaiting Approval: ${eventName}`,
      html,
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  },
})

export const sendEventApprovedEmail: unknown = schemaTask({
  id: 'send-event-approved-email',
  schema: EventApprovedPayloadSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async ({
    email,
    firstName,
    eventTitle,
    eventId,
  }) => {
    const html = await render(
      EventApprovedEmail({
        firstName,
        eventTitle,
        eventId,
      })
    )

    const { data, error } = await resend.emails.send({
      headers: {
        'X-Entity-Ref-ID': nanoid(),
      },
      from: 'Ticketeur <noreply@useticketeur.com>',
      to: [email],
      subject: `Great News! Your Event "${eventTitle}" Has Been Approved`,
      html,
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  },
})

export const sendEventDeclinedEmail: unknown = schemaTask({
  id: 'send-event-declined-email',
  schema: EventDeclinedPayloadSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async ({
    email,
    firstName,
    eventTitle,
    eventId,
    reason,
  }) => {
    const html = await render(
      EventDeclinedEmail({
        firstName,
        eventTitle,
        eventId,
        reason,
      })
    )

    const { data, error } = await resend.emails.send({
      headers: {
        'X-Entity-Ref-ID': nanoid(),
      },
      from: 'Ticketeur <noreply@useticketeur.com>',
      to: [email],
      subject: `Action Required: Your Event "${eventTitle}" Submission`,
      html,
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  },
})
