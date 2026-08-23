import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../../trpc'
import { validateVoucher } from '../../lib/vouchers'

export const publicVouchersRouter = createTRPCRouter({
  // Check a code against an event + subtotal and return the discount, or a
  // typed reason so the "Apply" UI can explain why it didn't work. This is
  // advisory for UX; checkout.start re-validates server-side before charging.
  validate: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        code: z.string().trim().min(1),
        subtotalMinor: z.number().int().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await validateVoucher(ctx.db, input)
      if (!result.ok) return { ok: false as const, reason: result.reason }
      return {
        ok: true as const,
        code: result.voucher.code,
        discountType: result.voucher.discountType,
        discountValue: result.voucher.discountValue,
        discountMinor: result.discountMinor,
      }
    }),
})

export type PublicVouchersRouter = typeof publicVouchersRouter
