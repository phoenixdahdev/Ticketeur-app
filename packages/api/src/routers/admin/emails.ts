import { and, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { tasks } from '@trigger.dev/sdk'
import { z } from 'zod'

import type { Database } from '@ticketur/db'
import { user } from '@ticketur/db'

import { adminProcedure, createTRPCRouter } from '../../trpc'
import { NOT_ADMIN, notCurrentlyBanned } from '../../lib/predicates'

// One Resend send per recipient (privacy), so a big audience is fanned out to
// the broadcast task in chunks of this size.
const BATCH_SIZE = 100

// Who a message goes to. `everyone` and `role` never include admins or banned
// accounts; `users` targets exactly the picked ids (banned still excluded).
const audienceSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('everyone') }),
  z.object({
    type: z.literal('role'),
    role: z.enum(['attendee', 'organizer', 'vendor']),
  }),
  z.object({
    type: z.literal('users'),
    userIds: z.array(z.string()).min(1).max(500),
  }),
])
type Audience = z.infer<typeof audienceSchema>

function audienceFilter(audience: Audience) {
  switch (audience.type) {
    case 'everyone':
      return and(NOT_ADMIN, notCurrentlyBanned)
    case 'role':
      return and(eq(user.role, audience.role), notCurrentlyBanned)
    case 'users':
      return and(inArray(user.id, audience.userIds), notCurrentlyBanned)
  }
}

async function resolveRecipients(db: Database, audience: Audience) {
  const rows = await db
    .select({ email: user.email })
    .from(user)
    .where(audienceFilter(audience))
  return rows.map((r) => r.email)
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

export const adminEmailsRouter = createTRPCRouter({
  // Typeahead for the "specific users" picker.
  searchRecipients: adminProcedure
    .input(z.object({ q: z.string().trim().default('') }))
    .query(async ({ ctx, input }) => {
      const filters = [notCurrentlyBanned]
      if (input.q.length > 0) {
        const needle = `%${input.q}%`
        filters.push(or(ilike(user.name, needle), ilike(user.email, needle))!)
      }
      return ctx.db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })
        .from(user)
        .where(and(...filters))
        .orderBy(desc(user.createdAt))
        .limit(20)
    }),

  // Live headcount for the chosen audience, so the composer can show (and the
  // confirm dialog can state) exactly how many people a send reaches.
  recipientCount: adminProcedure
    .input(audienceSchema)
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(user)
        .where(audienceFilter(input))
      return { count: Number(row?.value ?? 0) }
    }),

  send: adminProcedure
    .input(
      z.object({
        audience: audienceSchema,
        subject: z.string().trim().min(1, 'Subject required').max(200),
        // Markdown from the composer, rendered into the branded template.
        body: z.string().trim().min(1, 'Message body required').max(20_000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const emails = await resolveRecipients(ctx.db, input.audience)
      if (emails.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'That selection has no recipients to email.',
        })
      }

      // Fan out to the broadcast task in batches; each task sends one message
      // per recipient so nobody sees anyone else's address.
      for (const batch of chunk(emails, BATCH_SIZE)) {
        await tasks.trigger('send-admin-broadcast', {
          subject: input.subject,
          body: input.body,
          emails: batch,
        })
      }

      return { recipients: emails.length }
    }),
})

export type AdminEmailsRouter = typeof adminEmailsRouter
