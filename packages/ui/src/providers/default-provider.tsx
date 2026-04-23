'use client'

import { ReactLenis } from 'lenis/react'
import { ThemeProvider } from 'next-themes'
import { TRPCReactProvider } from './trpc-provider'
import type { ThemeProviderProps } from 'next-themes'
import { TooltipProvider } from '../components/tooltip'
import { Toaster } from '../components/sonner'
import ThemeSwitcher from '../miscellaneous/theme-switcher'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const inDevEnvironment = process.env.NODE_ENV === 'development'

export function DefaultProvider({
  children,
  trpcUrl,
  showQueryDevtools = inDevEnvironment,
  defaultTheme = 'system',
  useLens = false,
  ...rest
}: ThemeProviderProps & {
  trpcUrl: string
  showQueryDevtools?: boolean
  useLens?: boolean
}) {
  const content = (
    <TRPCReactProvider url={trpcUrl}>
      <ThemeProvider
        attribute="class"
        defaultTheme={defaultTheme}
        enableSystem
        disableTransitionOnChange
        {...rest}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-right" richColors closeButton />
        {showQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />}
        <ThemeSwitcher />
      </ThemeProvider>
    </TRPCReactProvider>
  )

  if (useLens) {
    return <ReactLenis root>{content}</ReactLenis>
  }

  return content
}
