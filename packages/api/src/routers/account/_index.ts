import { createTRPCRouter } from '../../trpc'

import { accountTicketsRouter } from './tickets'
import { accountReviewsRouter } from './reviews'

export const accountRouter = createTRPCRouter({
  tickets: accountTicketsRouter,
  reviews: accountReviewsRouter,
})

export type AccountRouter = typeof accountRouter
