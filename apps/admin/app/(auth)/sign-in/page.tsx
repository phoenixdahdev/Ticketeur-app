import type { Metadata } from 'next'
import Link from 'next/link'

import { AdminSignInForm } from '@/components/auth/admin-sign-in-form'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to the Ticketeur admin dashboard.',
}

export default function AdminSignInPage() {
  return (
    <main className="bg-background flex min-h-[calc(100vh-72px)] w-full items-center justify-center px-5 py-12 md:px-8">
      <div className="flex w-full max-w-[480px] flex-col">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-heading text-foreground text-4xl leading-none font-extrabold tracking-tight md:text-[56px]">
            Admin
          </h1>
          <p className="text-muted-foreground text-base leading-6 md:text-lg">
            Sign in to access platform controls
          </p>
        </header>

        <div className="mt-12 md:mt-14">
          <AdminSignInForm />
        </div>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          Need an admin account?{' '}
          <Link
            href="mailto:support@useticketeur.com"
            className="text-primary font-semibold hover:underline"
          >
            Contact support
          </Link>
        </p>
      </div>
    </main>
  )
}
