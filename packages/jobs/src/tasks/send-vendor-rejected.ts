import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import VendorRejectedEmail from '@ticketur/email/emails/vendor-rejected'

import { FROM_EMAIL } from '../constants'
import { vendorRejectedSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendVendorRejectedTask = task({
  id: 'send-vendor-rejected',
  run: async (payload: unknown) => {
    const data = vendorRejectedSchema.parse(payload)

    const html = await render(
      VendorRejectedEmail({
        vendorName: data.vendorName,
        businessName: data.businessName,
        reason: data.reason,
      })
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Your Ticketeur vendor application',
      html,
    })
  },
})
