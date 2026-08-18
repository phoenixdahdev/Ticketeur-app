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
        // Don't retry client errors (4xx) — a FORBIDDEN/NOT_FOUND/BAD_REQUEST
        // won't become valid by trying again; retrying just delays the error
        // reaching the UI. Retry up to 3× for everything else (network/5xx).
        retry: (failureCount, error) => {
          const status = (
            error as { data?: { httpStatus?: number } } | null
          )?.data?.httpStatus
          if (typeof status === 'number' && status >= 400 && status < 500) {
            return false
          }
          return failureCount < 3
        },
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
