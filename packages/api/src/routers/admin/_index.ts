import { createTRPCRouter } from '../../trpc'

import { adminUsersRouter } from './users'
import { adminEventsRouter } from './events'

export const adminRouter = createTRPCRouter({
  users: adminUsersRouter,
  events: adminEventsRouter,
})
