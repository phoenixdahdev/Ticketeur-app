import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import EventEditRejectedEmail from '@ticketur/email/emails/event-edit-rejected'

import { FROM_EMAIL } from '../constants'
import { eventEditRejectedSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendEventEditRejectedTask = task({
  id: 'send-event-edit-rejected',
  run: async (payload: unknown) => {
    const data = eventEditRejectedSchema.parse(payload)

    const html = await render(
      EventEditRejectedEmail({
        organizerName: data.organizerName,
        eventTitle: data.eventTitle,
        reason: data.reason,
      })
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Update on your changes to ${data.eventTitle}`,
      html,
    })
  },
})
