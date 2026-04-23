import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import TwoFactorOTPEmail from '@ticketur/email/emails/two-factor-otp'

import { FROM_EMAIL } from '../constants'
import { twoFactorOtpSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendTwoFactorOtpTask = task({
  id: 'send-two-factor-otp',
  run: async (payload: unknown) => {
    const data = twoFactorOtpSchema.parse(payload)

    const html = await render(TwoFactorOTPEmail({ otp: data.otp }))

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Your Ticketur 2FA code',
      html,
    })
  },
})
