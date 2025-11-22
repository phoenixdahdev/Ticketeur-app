import { nanoid } from 'nanoid'
import { resend } from '@jobs/utils/resend'
import { render } from '@react-email/render'
import { schemaTask } from '@trigger.dev/sdk'
import { EventApprovalRequestPayloadSchema } from '@jobs/schema'
import EventApprovalRequestEmail from '@useticketeur/email/emails/event-approval-request'

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
