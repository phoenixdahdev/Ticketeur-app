import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { createTRPCRouter } from '../trpc'

import { dashboardRouter } from './dashboard'
import { eventsRouter } from './events'
import { vendorsRouter } from './vendors'
import { vendorRouter } from './vendor/_index'
import { publicRouter } from './public/_index'

export const appRouter = createTRPCRouter({
  org: createTRPCRouter({
    dashboard: dashboardRouter,
    events: eventsRouter,
    vendors: vendorsRouter,
  }),
  vendor: vendorRouter,
  public: publicRouter,
})

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
