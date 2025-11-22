'use client'

import QueryProvider from './query-provider'
import { ThemeProviderProps } from 'next-themes'
import { ThemeProvider } from './theme-provider'
import { ProgressProvider } from '@bprogress/next/app'
import { Toaster } from '../components/sonner'
import { FloatingThemeToggle } from '../components/floating-theme-toogle'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function DefaultProvider({ children, ...rest }: ThemeProviderProps) {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light" {...rest}>
        <ProgressProvider
          style="style"
          options={{ showSpinner: false }}
          shallowRouting
        >
          {children}
        </ProgressProvider>
        <Toaster richColors />
        <ReactQueryDevtools />
        <FloatingThemeToggle />
      </ThemeProvider>
    </QueryProvider>
  )
}
