import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { events, orders, ticketTiers, user } from '@ticketur/db'
import { env } from '@ticketur/env/core'

import { createTRPCRouter, publicProcedure } from '../../trpc'
import { newId } from '../../lib/ids'
import { createPayment } from '../../lib/flutterwave'

const startInput = z.object({
  eventId: z.string(),
  tierId: z.string(),
  quantity: z.number().int().min(1).max(20),
  buyerName: z.string().trim().min(1, 'Name required'),
  buyerEmail: z.email('Enter a valid email'),
  buyerPhone: z.string().trim().min(7, 'Phone required'),
})

export const publicCheckoutRouter = createTRPCRouter({
  start: publicProcedure
    .input(startInput)
    .mutation(async ({ ctx, input }) => {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ??
        env.BETTER_AUTH_URL ??
        'http://localhost:3000'

      // Pull event + tier and validate stock atomically inside a transaction.
      const orderId = newId('ord')
      const txRef = `tckt_${orderId}_${Date.now()}`

      const totalsAndIds = await ctx.db.transaction(async (tx) => {
        const [event] = await tx
          .select({
            id: events.id,
            title: events.title,
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

        // Auto-link to an existing attendee user by email if there is one;
        // otherwise the order stays guest until a future signup matches.
        const [existing] = await tx
          .select({ id: user.id })
          .from(user)
          .where(eq(user.email, input.buyerEmail))
          .limit(1)

        const totalMinor = tier.priceMinor * input.quantity

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
          status: 'pending',
          flwTxRef: txRef,
        })

        return { totalMinor, eventTitle: event.title, tierName: tier.name }
      })

      // Hand off to Flutterwave. Amount is in major units (NGN).
      const { link } = await createPayment({
        txRef,
        amount: Math.round(totalsAndIds.totalMinor / 100),
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
          title: `${totalsAndIds.eventTitle} — ${totalsAndIds.tierName}`,
          description: `${input.quantity} ticket${input.quantity === 1 ? '' : 's'}`,
        },
      })

      return { orderId, txRef, paymentUrl: link }
    }),
})

export type PublicCheckoutRouter = typeof publicCheckoutRouter
