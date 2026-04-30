import { createTRPCRouter } from '../../trpc'

import { vendorDashboardRouter } from './dashboard'
import { vendorEventsRouter } from './events'
import { vendorProfileRouter } from './profile'

export const vendorRouter = createTRPCRouter({
  dashboard: vendorDashboardRouter,
  events: vendorEventsRouter,
  profile: vendorProfileRouter,
})

export type VendorRouter = typeof vendorRouter
