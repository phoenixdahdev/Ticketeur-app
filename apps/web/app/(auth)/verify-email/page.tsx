import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AuthShell } from '@/components/auth/auth-shell'
import { VerifyEmailForm } from '@/components/auth/verify-email-form'
import { SIGNUP_ROLES } from '@/lib/signup-roles'

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Enter the code we sent to your email.',
}

export default function VerifyEmailPage() {
  const { imageSrc, imageMobileSrc, imageAlt } = SIGNUP_ROLES.attendee

  return (
    <AuthShell
      imageSrc={imageSrc}
      imageMobileSrc={imageMobileSrc}
      imageAlt={imageAlt}
    >
      <Suspense>
        <VerifyEmailForm />
      </Suspense>
    </AuthShell>
  )
}
