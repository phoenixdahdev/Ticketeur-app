import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
  MutationCache,
  QueryKey,
} from '@tanstack/react-query'

export const TOKEN_MINUTE = 1000 * 60

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey
    }
  }
}

function makeQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 10 * TOKEN_MINUTE,
        staleTime: 1 * TOKEN_MINUTE,
        refetchInterval: 5 * TOKEN_MINUTE,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
    mutationCache: new MutationCache({
      onSettled: (_data, _error, _variables, _context, mutation) => {
        if (mutation.meta?.invalidatesQuery) {
          queryClient.invalidateQueries({
            queryKey: mutation.meta.invalidatesQuery,
          })
        }
      },
    }),
  })

  return queryClient
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
