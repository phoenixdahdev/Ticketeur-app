import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth'
import { MyTicketsContent } from '@/components/sections/account/my-tickets-content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My tickets',
  description: 'Tickets you’ve purchased on Ticketeur.',
}

export default async function MyTicketsPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login?redirect=/account/tickets')
  }
  return <MyTicketsContent />
}
