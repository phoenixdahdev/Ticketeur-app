import type { Metadata } from 'next'

import { AuthShell } from '@/components/auth/auth-shell'
import { ForgotPassword } from '@/components/auth/forgot-password'
import { SIGNUP_ROLES } from '@/lib/signup-roles'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Ticketur account password.',
}

export default function ForgotPasswordPage() {
  const { imageSrc, imageMobileSrc, imageAlt } = SIGNUP_ROLES.attendee

  return (
    <AuthShell
      imageSrc={imageSrc}
      imageMobileSrc={imageMobileSrc}
      imageAlt={imageAlt}
    >
      <ForgotPassword />
    </AuthShell>
  )
}
