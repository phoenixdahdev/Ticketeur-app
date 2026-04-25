import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthShell } from '@/components/auth/auth-shell'
import { SignupForm } from '@/components/auth/signup-form'
import { resolveSignupRole } from '@/lib/signup-roles'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your Ticketeur account.',
}

export default async function SignupPage(props: PageProps<'/signup'>) {
  const searchParams = await props.searchParams
  const config = resolveSignupRole(searchParams.role)

  return (
    <AuthShell
      imageSrc={config.imageSrc}
      imageMobileSrc={config.imageMobileSrc}
      imageAlt={config.imageAlt}
    >
      <div className="text-muted-foreground hidden items-center justify-end text-sm md:flex">
        Already have an account?&nbsp;
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Sign In
        </Link>
      </div>

      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-foreground text-2xl leading-tight font-bold tracking-tight md:text-[32px] md:leading-tight">
          {config.title}
        </h1>
        <p className="text-muted-foreground text-base leading-6">
          {config.description}
        </p>
      </header>

      <SignupForm config={config} />

      <p className="text-muted-foreground mt-2 text-center text-sm md:hidden">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Sign In
        </Link>
      </p>
    </AuthShell>
  )
}
