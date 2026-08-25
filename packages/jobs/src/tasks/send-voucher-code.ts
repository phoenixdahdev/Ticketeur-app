import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import VoucherCodeEmail from '@ticketur/email/emails/voucher-code'

import { FROM_EMAIL } from '../constants'
import { voucherCodeSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendVoucherCodeTask = task({
  id: 'send-voucher-code',
  run: async (payload: unknown) => {
    const data = voucherCodeSchema.parse(payload)

    // The body is identical for every recipient, so render once.
    const html = await render(
      VoucherCodeEmail({
        code: data.code,
        discountLabel: data.discountLabel,
        eventTitle: data.eventTitle,
        expiresOn: data.expiresOn,
        ctaUrl: data.ctaUrl,
        note: data.note,
      })
    )
    const subject = `${data.discountLabel} your next ticket — code ${data.code}`

    // Sent one at a time rather than as a single message with many `to`
    // addresses, so recipients never see each other. A failure is recorded and
    // skipped instead of aborting: one bad address must not cost the rest of
    // the batch, and Trigger's retry would otherwise re-send to everyone who
    // already received it.
    const failed: string[] = []
    for (const email of data.emails) {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject,
        html,
      })
      if (error) {
        console.error(`voucher email failed for ${email}: ${error.message}`)
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
