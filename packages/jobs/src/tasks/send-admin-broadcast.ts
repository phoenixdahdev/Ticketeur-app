import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import AdminBroadcastEmail from '@ticketur/email/emails/admin-broadcast'

import { FROM_EMAIL } from '../constants'
import { adminBroadcastSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendAdminBroadcastTask = task({
  id: 'send-admin-broadcast',
  run: async (payload: unknown) => {
    const data = adminBroadcastSchema.parse(payload)

    // The message is identical for every recipient, so render once.
    const html = await render(
      AdminBroadcastEmail({ subject: data.subject, body: data.body })
    )

    // Sent one at a time (never a shared `to`) so recipients don't see each
    // other. A failed address is recorded and skipped rather than aborting —
    // one bad email must not cost the rest of the batch, and a Trigger retry
    // would otherwise re-send to everyone who already received it.
    const failed: string[] = []
    for (const email of data.emails) {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: data.subject,
        html,
      })
      if (error) {
        console.error(`admin broadcast failed for ${email}: ${error.message}`)
        failed.push(email)
      }
    }

    return {
      requested: data.emails.length,
      sent: data.emails.length - failed.length,
      failed,
    }
  },
})
