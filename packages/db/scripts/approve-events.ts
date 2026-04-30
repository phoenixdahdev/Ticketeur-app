import 'dotenv/config'
import { eq, inArray } from 'drizzle-orm'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import EventApprovedEmail from '@ticketur/email/emails/event-approved'

import { db } from '../src/client'
import { events, user } from '../src/schema'

const FROM_EMAIL = 'Ticketeur <noreply@useticketeur.com>'
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL ??
  'http://localhost:3000'

function formatEventDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

async function main() {
  const resendKey = process.env.RESEND_API_KEY
  const resend = resendKey ? new Resend(resendKey) : null
  if (!resend) {
    console.warn(
      '⚠ RESEND_API_KEY not set — events will be promoted but no email will be sent.'
    )
  }

  const before = await db
    .select({
      id: events.id,
      title: events.title,
      status: events.status,
      organizerId: events.organizerId,
      eventDate: events.eventDate,
      location: events.location,
    })
    .from(events)

  console.log(`\n${before.length} event(s) found:`)
  for (const e of before) {
    console.log(`  • ${e.title.padEnd(40)}  ${e.status}  ${e.id}`)
  }

  const promotable = before.filter(
    (e) => e.status === 'in-review' || e.status === 'draft'
  )

  if (promotable.length === 0) {
    console.log('\nNothing to promote — all events already published or archived.')
    return
  }

  console.log(`\nPromoting ${promotable.length} → 'upcoming'…`)
  for (const e of promotable) {
    await db
      .update(events)
      .set({ status: 'upcoming', updatedAt: new Date() })
      .where(eq(events.id, e.id))
    console.log(`  ✓ ${e.title}`)
  }

  if (!resend) {
    console.log('\nDone (no emails sent).')
    return
  }

  // Look up organizer contacts in one round-trip
  const organizerIds = Array.from(new Set(promotable.map((e) => e.organizerId)))
  const organizers = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    .from(user)
    .where(inArray(user.id, organizerIds))

  const orgMap = new Map(organizers.map((o) => [o.id, o]))

  console.log('\nSending notification emails…')
  for (const e of promotable) {
    const organizer = orgMap.get(e.organizerId)
    if (!organizer) {
      console.warn(`  ⚠ ${e.title} — no organizer found, skipping email`)
      continue
    }

    const html = await render(
      EventApprovedEmail({
        organizerName: organizer.name,
        eventTitle: e.title,
        eventDate: formatEventDate(e.eventDate),
        eventLocation: e.location,
        publicUrl: `${BASE_URL}/events/${e.id}`,
        manageUrl: `${BASE_URL}/org/events/${e.id}`,
      })
    )

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: organizer.email,
        subject: `${e.title} is now live`,
        html,
      })
      console.log(`  ✓ ${organizer.email}  ${e.title}`)
    } catch (err) {
      console.error(`  ✗ ${organizer.email}  ${e.title} —`, (err as Error).message)
    }
  }

  console.log('\nDone.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => process.exit(0))
