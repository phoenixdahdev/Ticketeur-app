import { Resend } from 'resend'
import { env } from '@ticketur/env/core'

export const resend = new Resend(env.RESEND_API_KEY)
