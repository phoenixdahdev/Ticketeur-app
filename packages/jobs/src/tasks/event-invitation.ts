import { nanoid } from 'nanoid'
import { resend } from '@jobs/utils/resend'
import { render } from '@react-email/render'
import { schemaTask } from '@trigger.dev/sdk'
import { EventInvitationPayloadSchema } from '@jobs/schema'
import EventInvitationEmail from '@useticketeur/email/emails/event-invitation'

export const sendEventInvitationEmail: unknown = schemaTask({
  id: 'send-event-invitation-email',
  schema: EventInvitationPayloadSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async ({
    email,
    inviteeName,
    inviterName,
    eventName,
    eventDate,
    role,
    acceptUrl,
    declineUrl,
  }) => {
    const html = await render(
      EventInvitationEmail({
        inviteeName: inviteeName || 'there',
        inviterName,
        eventName,
        eventDate,
        role,
        acceptUrl,
        declineUrl,
      })
    )

    const { data, error } = await resend.emails.send({
      headers: {
        'X-Entity-Ref-ID': nanoid(),
      },
      from: 'Ticketeur <noreply@useticketeur.com>',
      to: [email],
      subject: `You're invited to join ${eventName} on Ticketeur`,
      html,
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  },
})
