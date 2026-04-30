import type { ActivityType } from '@ticketur/db'
import { activityLog } from '@ticketur/db'

import type { Context } from '../trpc'
import { newId } from './ids'

export async function logActivity(
  ctx: Context,
  args: {
    organizerId: string
    type: ActivityType
    eventId?: string | null
    payload?: Record<string, unknown>
  }
) {
  await ctx.db.insert(activityLog).values({
    id: newId('act'),
    organizerId: args.organizerId,
    type: args.type,
    eventId: args.eventId ?? null,
    payload: args.payload ?? {},
  })
}
