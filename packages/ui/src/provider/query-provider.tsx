import { getQueryClient } from '../tools/query-client'
import { QueryClientProvider } from '@tanstack/react-query'

interface QueryProviderProps {
  children: React.ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
