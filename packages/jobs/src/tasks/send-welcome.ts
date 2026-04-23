import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import WelcomeEmail from '@ticketur/email/emails/welcome'

import { FROM_EMAIL } from '../constants'
import { welcomeEmailSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendWelcomeTask = task({
  id: 'send-welcome',
  run: async (payload: unknown) => {
    const data = welcomeEmailSchema.parse(payload)

    const html = await render(WelcomeEmail({ name: data.name }))

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Welcome to Ticketur',
      html,
    })
  },
})
