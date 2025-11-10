'use client'

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...rest }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
      {...rest}
    >
      {children}
    </NextThemesProvider>
  )
}
