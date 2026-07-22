import { createTRPCRouter } from '../../trpc'

import { accountTicketsRouter } from './tickets'

export const accountRouter = createTRPCRouter({
  tickets: accountTicketsRouter,
})

export type AccountRouter = typeof accountRouter
