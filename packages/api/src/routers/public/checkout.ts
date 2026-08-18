import { randomUUID } from 'node:crypto'

import { TRPCError } from '@trpc/server'
import { tasks } from '@trigger.dev/sdk'
import { and, eq, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'

import {
  events,
  orders,
  orderItems,
  ticketTiers,
  tickets,
  user,
} from '@ticketur/db'

import { createTRPCRouter, publicProcedure } from '../../trpc'
import { newId } from '../../lib/ids'
import { getBaseUrl } from '../../lib/base-url'
import { formatEventDateRange } from '../../lib/dates'
import { createPayment } from '../../lib/flutterwave'
import { generateAndStoreTicketsPdf } from '../../lib/tickets-pdf'
import { calculateFeeMinor } from '../../lib/fees'

// A cart is one or more tier lines. The buyer can mix tiers (e.g. a free
// tier + VIP + General) in a single order; the whole cart is one order and,
// if anything is payable, one Flutterwave transaction.
const startInput = z.object({
  eventId: z.string(),
  items: z
    .array(
      z.object({
        tierId: z.string(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, 'Select at least one ticket')
    .max(20, 'Too many tiers in one order'),
  buyerName: z.string().trim().min(1, 'Name required'),
  buyerEmail: z.email('Enter a valid email'),
  buyerPhone: z.string().trim().min(7, 'Phone required'),
})

export const publicCheckoutRouter = createTRPCRouter({
  start: publicProcedure.input(startInput).mutation(async ({ ctx, input }) => {
    const baseUrl = getBaseUrl()

    // Collapse duplicate tier lines so each tier appears at most once.
    const mergedQty = new Map<string, number>()
    for (const item of input.items) {
      mergedQty.set(
        item.tierId,
        (mergedQty.get(item.tierId) ?? 0) + item.quantity
      )
    }
    const totalQuantity = [...mergedQty.values()].reduce((a, b) => a + b, 0)
    if (totalQuantity > 50) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You can buy at most 50 tickets per order.',
      })
    }

    const orderId = newId('ord')
    const txRef = `tckt_${orderId}_${Date.now()}`

    // Validate event + every tier + stock and create the order plus its line
    // items in one tx. For a fully-free cart we also generate ticket rows and
    // bump tier.sold here so the buyer is fulfilled immediately without FW.
    const result = await ctx.db.transaction(async (tx) => {
      const [event] = await tx
        .select({
          id: events.id,
          title: events.title,
          eventDate: events.eventDate,
          endDate: events.endDate,
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

      const tierIds = [...mergedQty.keys()]
      const tierRows = await tx
        .select({
          id: ticketTiers.id,
          name: ticketTiers.name,
          quantity: ticketTiers.quantity,
          sold: ticketTiers.sold,
          priceMinor: ticketTiers.priceMinor,
        })
        .from(ticketTiers)
        .where(
          and(
            eq(ticketTiers.eventId, event.id),
            inArray(ticketTiers.id, tierIds)
          )
        )
      const tierById = new Map(tierRows.map((t) => [t.id, t]))

      // Build the lines, asserting each tier exists, belongs to the event,
      // and has stock. The conditional UPDATE below is the real race guard;
      // this pre-check just produces friendly per-tier messages.
      const lines = tierIds.map((tierId) => {
        const tier = tierById.get(tierId)
        if (!tier) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'One of the selected tiers is unavailable',
          })
        }
        const quantity = mergedQty.get(tierId)!
        const remaining = tier.quantity - tier.sold
        if (remaining < quantity) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              remaining <= 0
                ? `${tier.name} is sold out — sorry!`
                : `Only ${remaining} ${tier.name} ticket${remaining === 1 ? '' : 's'} left.`,
          })
        }
        return { tier, quantity, lineSubtotal: tier.priceMinor * quantity }
      })

      const subtotalMinor = lines.reduce((s, l) => s + l.lineSubtotal, 0)
      const feeMinor = calculateFeeMinor(subtotalMinor)
      const totalMinor = subtotalMinor + feeMinor
      const isFree = totalMinor === 0

      const [existing] = await tx
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, input.buyerEmail))
        .limit(1)

      await tx.insert(orders).values({
        id: orderId,
        eventId: event.id,
        // Multi-tier orders carry their tiers in order_items; the legacy
        // single tierId stays null.
        tierId: null,
        buyerId: existing?.id ?? null,
        buyerEmail: input.buyerEmail,
        buyerName: input.buyerName,
        buyerPhone: input.buyerPhone,
        quantity: totalQuantity,
        subtotalMinor,
        feeMinor,
        totalMinor,
        status: isFree ? 'paid' : 'pending',
        flwTxRef: isFree ? null : txRef,
        paidAt: isFree ? new Date() : null,
      })

      await tx.insert(orderItems).values(
        lines.map((l) => ({
          id: newId('oi'),
          orderId,
          tierId: l.tier.id,
          tierName: l.tier.name,
          unitPriceMinor: l.tier.priceMinor,
          quantity: l.quantity,
        }))
      )

      if (isFree) {
        // Per line: bump tier.sold atomically with a conditional update —
        // guards against two simultaneous free claims racing past the cap —
        // then mint one ticket row per unit.
        const ticketRows: {
          id: string
          orderId: string
          eventId: string
          tierId: string
          code: string
        }[] = []
        for (const l of lines) {
          const updated = await tx
            .update(ticketTiers)
            .set({ sold: sql`${ticketTiers.sold} + ${l.quantity}` })
            .where(
              and(
                eq(ticketTiers.id, l.tier.id),
                sql`${ticketTiers.sold} + ${l.quantity} <= ${ticketTiers.quantity}`
              )
            )
            .returning({ id: ticketTiers.id })
          if (updated.length === 0) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: `${l.tier.name} just sold out — please try again.`,
            })
          }
          for (let i = 0; i < l.quantity; i += 1) {
            ticketRows.push({
              id: `tkt_${randomUUID()}`,
              orderId,
              eventId: event.id,
              tierId: l.tier.id,
              code: randomUUID().replace(/-/g, ''),
            })
          }
        }
        await tx.insert(tickets).values(ticketRows)
      }

      return {
        totalMinor,
        isFree,
        eventTitle: event.title,
        eventDate: event.eventDate,
        endDate: event.endDate,
        eventTime: event.eventTime,
        eventLocation: event.location,
        items: lines.map((l) => ({
          tierName: l.tier.name,
          quantity: l.quantity,
        })),
      }
    })

    const totalQty = result.items.reduce((s, i) => s + i.quantity, 0)
    // "2× VIP, 1× General" — used for the FW description, the email subject
    // line summary, and the legacy single `ticketTier` field.
    const summaryLabel = result.items
      .map((i) => `${i.quantity}× ${i.tierName}`)
      .join(', ')

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
        eventDate: formatEventDateRange(result.eventDate, result.endDate),
        eventTime: result.eventTime,
        eventLocation: result.eventLocation,
        ticketTier: summaryLabel,
        items: result.items,
        quantity: totalQty,
        ticketsUrl: `${baseUrl}/tickets/${orderId}`,
        pdfUrl: pdfUrl ?? undefined,
        pdfFilename: pdfUrl ? `${result.eventTitle}-tickets.pdf` : undefined,
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
      },
      customizations: {
        title: result.eventTitle,
        description: `${totalQty} ticket${totalQty === 1 ? '' : 's'} — ${summaryLabel}`,
      },
    })

    return { orderId, txRef, paymentUrl: link, free: false }
  }),
})

export type PublicCheckoutRouter = typeof publicCheckoutRouter
