'use client'

import { Toaster } from 'ui/sonner'
import { ProgressProvider } from '@bprogress/next/app'
import { getQueryClient } from '~/lib/get-query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function Provider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider
        style="style"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
      <Toaster richColors />
      <ReactQueryDevtools
        initialIsOpen={false}
        position="left"
        buttonPosition="top-right"
      />
    </QueryClientProvider>
  )
}
