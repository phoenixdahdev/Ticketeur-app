import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'

import { db, tickets } from '@ticketur/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Ticket',
}

// Single-ticket QR landing — used as the URL encoded into per-ticket QR
// codes. Resolves the code to its order and redirects to the order page so
// users see all their tickets in one place. (Future: dedicated check-in view
// for organisers / venue staff.)
export default async function TicketByCodePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const [row] = await db
    .select({ orderId: tickets.orderId })
    .from(tickets)
    .where(eq(tickets.code, code))
    .limit(1)

  if (!row) notFound()
  redirect(`/tickets/${row.orderId}`)
}
