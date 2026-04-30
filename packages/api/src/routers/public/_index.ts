import { createTRPCRouter } from '../../trpc'

import { publicEventsRouter } from './events'
import { publicVendorsRouter } from './vendors'

export const publicRouter = createTRPCRouter({
  events: publicEventsRouter,
  vendors: publicVendorsRouter,
})

export type PublicRouter = typeof publicRouter
