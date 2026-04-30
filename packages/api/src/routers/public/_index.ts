import { createTRPCRouter } from '../../trpc'

import { publicCheckoutRouter } from './checkout'
import { publicEventsRouter } from './events'
import { publicVendorsRouter } from './vendors'

export const publicRouter = createTRPCRouter({
  checkout: publicCheckoutRouter,
  events: publicEventsRouter,
  vendors: publicVendorsRouter,
})

export type PublicRouter = typeof publicRouter
