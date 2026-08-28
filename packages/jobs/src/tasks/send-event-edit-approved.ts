import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import EventEditApprovedEmail from '@ticketur/email/emails/event-edit-approved'

import { FROM_EMAIL } from '../constants'
import { eventEditApprovedSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendEventEditApprovedTask = task({
  id: 'send-event-edit-approved',
  run: async (payload: unknown) => {
    const data = eventEditApprovedSchema.parse(payload)

    const html = await render(
      EventEditApprovedEmail({
        organizerName: data.organizerName,
        eventTitle: data.eventTitle,
        publicUrl: data.publicUrl,
        manageUrl: data.manageUrl,
      })
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Your changes to ${data.eventTitle} are live`,
      html,
    })
  },
})
