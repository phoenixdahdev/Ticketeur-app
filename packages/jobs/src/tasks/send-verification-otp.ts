import { task } from '@trigger.dev/sdk'
import { render } from '@react-email/render'
import VerificationOTPEmail from '@ticketur/email/emails/verification-otp'

import { FROM_EMAIL } from '../constants'
import { verificationOtpSchema } from '../schema'
import { resend } from '../utils/resend'

export const sendVerificationOtpTask = task({
  id: 'send-verification-otp',
  run: async (payload: unknown) => {
    const data = verificationOtpSchema.parse(payload)

    const html = await render(
      VerificationOTPEmail({ otp: data.otp, type: data.type })
    )

    const subjectByType = {
      'email-verification': 'Verify your email',
      'sign-in': 'Your Ticketur sign-in code',
      'forget-password': 'Your password reset code',
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: subjectByType[data.type],
      html,
    })
  },
})
