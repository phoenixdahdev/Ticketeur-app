import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'
import { SIGNUP_ROLES } from '@/lib/signup-roles'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Ticketur account.',
}

export default function LoginPage() {
  const { imageSrc, imageMobileSrc, imageAlt } = SIGNUP_ROLES.attendee

  return (
    <AuthShell
      imageSrc={imageSrc}
      imageMobileSrc={imageMobileSrc}
      imageAlt={imageAlt}
    >
      <div className="text-muted-foreground hidden items-center justify-end text-sm md:flex">
        Don&apos;t have an account?&nbsp;
        <Link
          href="/get-started"
          className="text-primary font-semibold hover:underline"
        >
          Sign Up
        </Link>
      </div>

      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-foreground text-2xl leading-tight font-bold tracking-tight md:text-[32px] md:leading-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-base leading-6">
          Sign in to your Ticketur account to continue.
        </p>
      </header>

      <LoginForm />

      <p className="text-muted-foreground mt-2 text-center text-sm md:hidden">
        Don&apos;t have an account?{' '}
        <Link
          href="/get-started"
          className="text-primary font-semibold hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </AuthShell>
  )
}
