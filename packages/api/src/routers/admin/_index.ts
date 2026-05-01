import { createTRPCRouter } from '../../trpc'

import { adminUsersRouter } from './users'
import { adminEventsRouter } from './events'
import { adminTransactionsRouter } from './transactions'
import { adminModerationRouter } from './moderation'
import { adminOverviewRouter } from './overview'

export const adminRouter = createTRPCRouter({
  users: adminUsersRouter,
  events: adminEventsRouter,
  transactions: adminTransactionsRouter,
  moderation: adminModerationRouter,
  overview: adminOverviewRouter,
})
