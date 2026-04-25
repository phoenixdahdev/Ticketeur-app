import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { ResetPassword } from '@/components/auth/reset-password'
import { SIGNUP_ROLES } from '@/lib/signup-roles'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your Ticketeur account.',
}

export default async function ResetPasswordPage(
  props: PageProps<'/reset-password'>
) {
  const searchParams = await props.searchParams
  const token = searchParams.token

  const { imageSrc, imageMobileSrc, imageAlt } = SIGNUP_ROLES.attendee

  return (
    <AuthShell
      imageSrc={imageSrc}
      imageMobileSrc={imageMobileSrc}
      imageAlt={imageAlt}
    >
      <ResetPassword />
    </AuthShell>
  )
}
