import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import AccountDisabledEmail from '@ticketur/email/emails/account-disabled'

import { FROM_EMAIL } from '../constants'
import { accountDisabledSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendAccountDisabledTask = task({
  id: 'send-account-disabled',
  run: async (payload: unknown) => {
    const data = accountDisabledSchema.parse(payload)

    const html = await render(
      AccountDisabledEmail({
        name: data.name,
        reason: data.reason,
      })
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Your Ticketeur account has been disabled',
      html,
    })
  },
})
