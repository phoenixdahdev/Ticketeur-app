import type { Metadata } from 'next'

import { AuthShell } from '@/components/auth/auth-shell'
import { TwoFactorForm } from '@/components/auth/two-factor-form'
import { SIGNUP_ROLES } from '@/lib/signup-roles'

export const metadata: Metadata = {
  title: 'Two-Factor Authentication',
  description: 'Enter your authentication code to sign in.',
}

export default function TwoFactorPage() {
  const { imageSrc, imageMobileSrc, imageAlt } = SIGNUP_ROLES.attendee

  return (
    <AuthShell
      imageSrc={imageSrc}
      imageMobileSrc={imageMobileSrc}
      imageAlt={imageAlt}
    >
      <TwoFactorForm />
    </AuthShell>
  )
}
