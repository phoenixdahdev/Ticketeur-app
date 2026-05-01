import { createTRPCRouter } from '../../trpc'

import { adminUsersRouter } from './users'

export const adminRouter = createTRPCRouter({
  users: adminUsersRouter,
})
