import type { Metadata } from 'next'

import { EmailComposeContent } from '@/components/dashboard/emails/compose-content'

export const metadata: Metadata = {
  title: 'Emails',
}

export default function EmailsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Send an email
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Compose a message and send it to everyone, a role, or specific users.
          The Ticketeur header and footer are added automatically.
        </p>
      </header>

      <EmailComposeContent />
    </div>
  )
}
