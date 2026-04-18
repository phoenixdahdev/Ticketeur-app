'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import type { AppRouter } from '@ticketur/api'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchStreamLink, loggerLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import superjson from 'superjson'
import { getQueryClient } from '../lib/query-client'

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

export function TRPCReactProvider({
  children,
  url,
}: {
  children: ReactNode
  url: string
}) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchStreamLink({
          url,
          transformer: superjson,
        }),
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
