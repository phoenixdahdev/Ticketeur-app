import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import VendorApprovedEmail from '@ticketur/email/emails/vendor-approved'

import { FROM_EMAIL } from '../constants'
import { vendorApprovedSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendVendorApprovedTask = task({
  id: 'send-vendor-approved',
  run: async (payload: unknown) => {
    const data = vendorApprovedSchema.parse(payload)

    const html = await render(
      VendorApprovedEmail({
        vendorName: data.vendorName,
        businessName: data.businessName,
        profileUrl: data.profileUrl,
      })
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `${data.businessName} is approved on Ticketeur`,
      html,
    })
  },
})
