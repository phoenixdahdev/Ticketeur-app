import { nanoid } from 'nanoid'
import { resend } from '@jobs/utils/resend'
import { render } from '@react-email/render'
import { schemaTask } from '@trigger.dev/sdk'
import { VerificationEmailPayloadSchema, } from '@jobs/schema'
import VerificationEmail from '@useticketeur/email/emails/verification-email'

export const sendVerificationEmail: unknown = schemaTask({
    id: 'send-verification-email',
    schema: VerificationEmailPayloadSchema,
    maxDuration: 30,
    queue: {
        concurrencyLimit: 10,
    },
    run: async ({ otp, email, name }) => {
        const html = await render(VerificationEmail({ otp, firstName: name }))
        const { data, error } = await resend.emails.send({
            headers: {
                'X-Entity-Ref-ID': nanoid(),
            },
            from: 'Ticketeur <noreply@useticketeur.com>',
            to: [email],
            subject: 'Your Ticketeur Verification Code',
            html,
        })

        if (error) {
            throw error
        }
        return { success: true, data }
    },
})
