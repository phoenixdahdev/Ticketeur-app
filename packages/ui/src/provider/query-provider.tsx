import {
  QueryClientProvider,
  QueryClientProviderProps,
} from '@tanstack/react-query'
import { getQueryClient } from '../tools/query-client.js'

export default function QueryProvider({
  children,
  client,
  ...rest
}: QueryClientProviderProps) {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient} {...rest}>
      {children}
    </QueryClientProvider>
  )
}
