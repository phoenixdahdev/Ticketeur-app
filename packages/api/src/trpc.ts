import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

import type { Session } from '@ticketur/auth'
import { db } from '@ticketur/db'

export type Context = {
  session: Session | null
  db: typeof db
}

export async function createTRPCContext({
  session,
}: {
  session: Session | null
}): Promise<Context> {
  return { session, db }
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const publicProcedure = t.procedure

const requireSession = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  })
})

export const protectedProcedure = t.procedure.use(requireSession)

const requireOrganizer = requireSession.unstable_pipe(({ ctx, next }) => {
  const role = ctx.session.user.role ?? 'attendee'
  if (role !== 'organizer' && role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Organizer role required' })
  }
  return next({ ctx })
})

export const organizerProcedure = t.procedure.use(requireOrganizer)

const requireVendor = requireSession.unstable_pipe(({ ctx, next }) => {
  const role = ctx.session.user.role ?? 'attendee'
  if (role !== 'vendor' && role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Vendor role required' })
  }
  return next({ ctx })
})

export const vendorProcedure = t.procedure.use(requireVendor)
