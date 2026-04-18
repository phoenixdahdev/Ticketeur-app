import {
  isServer,
  QueryClient,
  defaultShouldDehydrateQuery,
} from '@tanstack/react-query'
import superjson from 'superjson'
import { cache } from 'react'

export const TOKEN_MINUTE = 1000 * 60

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 5 * TOKEN_MINUTE,
        staleTime: 1 * TOKEN_MINUTE,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

const getRequestQueryClient = cache(() => makeQueryClient())

export function getQueryClient() {
  if (isServer) {
    return getRequestQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
