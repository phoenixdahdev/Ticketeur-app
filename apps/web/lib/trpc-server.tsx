import 'server-only'

import { cache, type ReactNode } from 'react'
import { headers } from 'next/headers'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import { appRouter, createTRPCContext } from '@ticketur/api'
import { getQueryClient } from '@ticketur/ui/lib/query-client'

import { auth } from './auth'

// Server-side tRPC for prefetching in server components. The proxy runs
// procedures directly (no HTTP hop) and writes results into the per-request
// query client. Because the query keys are identical to the client's
// `useTRPC()` proxy, the client `useQuery` calls hydrate from this data
// instead of firing their own round-trip after JS loads.
//
// cache() ties the proxy + client to the request, so several prefetches in one
// render share the same client that HydrateClient then dehydrates. A prefetch
// whose key doesn't match its client caller is simply unused — never an error.
export const getServerTRPC = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  const ctx = await createTRPCContext({ session })
  const queryClient = getQueryClient()
  const trpc = createTRPCOptionsProxy({ ctx, router: appRouter, queryClient })
  return { trpc, queryClient }
})

// Wrap the client subtree that should hydrate from whatever this request
// prefetched. Render it AFTER awaiting the prefetch calls.
export async function HydrateClient({ children }: { children: ReactNode }) {
  const { queryClient } = await getServerTRPC()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
