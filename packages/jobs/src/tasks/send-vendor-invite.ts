import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import VendorInviteEmail from '@ticketur/email/emails/vendor-invite'

import { FROM_EMAIL } from '../constants'
import { vendorInviteSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendVendorInviteTask = task({
  id: 'send-vendor-invite',
  run: async (payload: unknown) => {
    const data = vendorInviteSchema.parse(payload)

    const html = await render(
      VendorInviteEmail({
        businessName: data.businessName,
        contactName: data.contactName,
        organizerName: data.organizerName,
        eventTitle: data.eventTitle,
        signupUrl: data.signupUrl,
      })
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `You're invited to ${data.eventTitle}`,
      html,
    })
  },
})
