import { createTRPCRouter } from '../../trpc'

import { publicCheckoutRouter } from './checkout'
import { publicEventsRouter } from './events'
import { publicVendorsRouter } from './vendors'
import { publicReviewsRouter } from './reviews'

export const publicRouter = createTRPCRouter({
  checkout: publicCheckoutRouter,
  events: publicEventsRouter,
  vendors: publicVendorsRouter,
  reviews: publicReviewsRouter,
})

export type PublicRouter = typeof publicRouter
