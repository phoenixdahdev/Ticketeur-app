import { randomUUID } from 'node:crypto'

import { TRPCError } from '@trpc/server'
import { tasks } from '@trigger.dev/sdk'
import { and, eq, sql } from 'drizzle-orm'
import { z } from 'zod'

import {
  events,
  orders,
  ticketTiers,
  tickets,
  user,
} from '@ticketur/db'
import { env } from '@ticketur/env/core'

import { createTRPCRouter, publicProcedure } from '../../trpc'
import { newId } from '../../lib/ids'
import { createPayment } from '../../lib/flutterwave'
import { generateAndStoreTicketsPdf } from '../../lib/tickets-pdf'

const startInput = z.object({
  eventId: z.string(),
  tierId: z.string(),
  quantity: z.number().int().min(1).max(20),
  buyerName: z.string().trim().min(1, 'Name required'),
  buyerEmail: z.email('Enter a valid email'),
  buyerPhone: z.string().trim().min(7, 'Phone required'),
})

function formatEventDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
}

export const publicCheckoutRouter = createTRPCRouter({
  start: publicProcedure
    .input(startInput)
    .mutation(async ({ ctx, input }) => {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ??
        env.BETTER_AUTH_URL ??
        'http://localhost:3000'

      const orderId = newId('ord')
      const txRef = `tckt_${orderId}_${Date.now()}`

      // Validate event + tier + stock and create the order in one tx. For
      // free tiers we also generate ticket rows and bump tier.sold here so
      // the buyer is fulfilled immediately without ever touching FW.
      const result = await ctx.db.transaction(async (tx) => {
        const [event] = await tx
          .select({
            id: events.id,
            title: events.title,
            eventDate: events.eventDate,
            eventTime: events.eventTime,
            location: events.location,
            status: events.status,
          })
          .from(events)
          .where(eq(events.id, input.eventId))
          .limit(1)
        if (!event) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
        }
        if (event.status !== 'upcoming') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Event is not on sale',
          })
        }

        const [tier] = await tx
          .select({
            id: ticketTiers.id,
            eventId: ticketTiers.eventId,
            name: ticketTiers.name,
            quantity: ticketTiers.quantity,
            sold: ticketTiers.sold,
            priceMinor: ticketTiers.priceMinor,
          })
          .from(ticketTiers)
          .where(
            and(
              eq(ticketTiers.id, input.tierId),
              eq(ticketTiers.eventId, input.eventId)
            )
          )
          .limit(1)
        if (!tier) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Tier not found' })
        }
        const remaining = tier.quantity - tier.sold
        if (remaining < input.quantity) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              remaining <= 0
                ? 'Sold out — sorry!'
                : `Only ${remaining} ticket${remaining === 1 ? '' : 's'} left for this tier.`,
          })
        }

        const [existing] = await tx
          .select({ id: user.id })
          .from(user)
          .where(eq(user.email, input.buyerEmail))
          .limit(1)

        const totalMinor = tier.priceMinor * input.quantity
        const isFree = totalMinor === 0

        await tx.insert(orders).values({
          id: orderId,
          eventId: event.id,
          tierId: tier.id,
          buyerId: existing?.id ?? null,
          buyerEmail: input.buyerEmail,
          buyerName: input.buyerName,
          buyerPhone: input.buyerPhone,
          quantity: input.quantity,
          totalMinor,
          status: isFree ? 'paid' : 'pending',
          flwTxRef: isFree ? null : txRef,
          paidAt: isFree ? new Date() : null,
        })

        if (isFree) {
          // Bump tier.sold atomically with a conditional update — guards
          // against two simultaneous free claims racing past the cap.
          const updated = await tx
            .update(ticketTiers)
            .set({ sold: sql`${ticketTiers.sold} + ${input.quantity}` })
            .where(
              and(
                eq(ticketTiers.id, tier.id),
                sql`${ticketTiers.sold} + ${input.quantity} <= ${ticketTiers.quantity}`
              )
            )
            .returning({ id: ticketTiers.id })
          if (updated.length === 0) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Tickets just sold out — please try again.',
            })
          }

          // One ticket row per unit purchased.
          const ticketRows = Array.from({ length: input.quantity }).map(() => ({
            id: `tkt_${randomUUID()}`,
            orderId,
            eventId: event.id,
            tierId: tier.id,
            code: randomUUID().replace(/-/g, ''),
          }))
          await tx.insert(tickets).values(ticketRows)
        }

        return {
          totalMinor,
          isFree,
          eventTitle: event.title,
          eventDate: event.eventDate,
          eventTime: event.eventTime,
          eventLocation: event.location,
          tierName: tier.name,
        }
      })

      if (result.isFree) {
        // Free path — no FW. Generate the PDF (with QR codes) and email it
        // so the buyer can scan at the gate just like a paid ticket.
        let pdfUrl: string | null = null
        try {
          pdfUrl = await generateAndStoreTicketsPdf({ orderId, baseUrl })
        } catch (err) {
          console.error('free ticket PDF generation failed', err)
        }

        const firstName = input.buyerName.split(' ')[0] ?? input.buyerName
        void tasks.trigger('send-ticket-confirmation', {
          email: input.buyerEmail,
          firstName,
          eventTitle: result.eventTitle,
          eventDate: formatEventDate(result.eventDate),
          eventTime: result.eventTime,
          eventLocation: result.eventLocation,
          ticketTier: result.tierName,
          quantity: input.quantity,
          ticketsUrl: `${baseUrl}/tickets/${orderId}`,
          pdfUrl: pdfUrl ?? undefined,
          pdfFilename: pdfUrl
            ? `${result.eventTitle}-tickets.pdf`
            : undefined,
        })
        return { orderId, txRef: null, paymentUrl: null, free: true }
      }

      // Paid path — hand off to Flutterwave. Amount in major units (NGN).
      const { link } = await createPayment({
        txRef,
        amount: Math.round(result.totalMinor / 100),
        currency: 'NGN',
        redirectUrl: `${baseUrl}/checkout/return`,
        customer: {
          email: input.buyerEmail,
          name: input.buyerName,
          phonenumber: input.buyerPhone,
        },
        meta: {
          orderId,
          eventId: input.eventId,
          tierId: input.tierId,
          quantity: input.quantity,
        },
        customizations: {
          title: `${result.eventTitle} — ${result.tierName}`,
          description: `${input.quantity} ticket${input.quantity === 1 ? '' : 's'}`,
        },
      })

      return { orderId, txRef, paymentUrl: link, free: false }
    }),
})

export type PublicCheckoutRouter = typeof publicCheckoutRouter
