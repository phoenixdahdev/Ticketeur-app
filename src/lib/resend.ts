import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
export const from_email = process.env.AUTH_EMAIL as string