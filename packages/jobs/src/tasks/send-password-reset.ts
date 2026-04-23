import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import PasswordResetEmail from '@ticketur/email/emails/password-reset'

import { FROM_EMAIL } from '../constants'
import { passwordResetSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendPasswordResetTask = task({
  id: 'send-password-reset',
  run: async (payload: unknown) => {
    const data = passwordResetSchema.parse(payload)

    const html = await render(
      PasswordResetEmail({ name: data.name, resetUrl: data.resetUrl })
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Reset your Ticketur password',
      html,
    })
  },
})
