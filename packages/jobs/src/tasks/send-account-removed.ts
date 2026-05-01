import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import AccountRemovedEmail from '@ticketur/email/emails/account-removed'

import { FROM_EMAIL } from '../constants'
import { accountRemovedSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendAccountRemovedTask = task({
  id: 'send-account-removed',
  run: async (payload: unknown) => {
    const data = accountRemovedSchema.parse(payload)

    const html = await render(AccountRemovedEmail({ name: data.name }))

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Your Ticketeur account has been removed',
      html,
    })
  },
})
