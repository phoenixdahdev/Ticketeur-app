"use client"

import { ThemeProvider } from "next-themes"
import { TRPCReactProvider } from "./trpc-provider"
import type { ThemeProviderProps } from "next-themes"
import { TooltipProvider } from "../components/tooltip"
import ThemeSwitcher from "../miscellaneous/theme-switcher"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export const inDevEnvironment = process.env.NODE_ENV === "development"

export function DefaultProvider({
  children,
  trpcUrl,
  showQueryDevtools = inDevEnvironment,
  defaultTheme = "system",
  ...rest
}: ThemeProviderProps & {
  trpcUrl: string
  showQueryDevtools?: boolean
}) {
  return (
    <TRPCReactProvider url={trpcUrl}>
      <ThemeProvider
        attribute="class"
        defaultTheme={defaultTheme}
        enableSystem
        disableTransitionOnChange
        {...rest}
      >
        <TooltipProvider>{children}</TooltipProvider>
        {showQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />}
        <ThemeSwitcher />
      </ThemeProvider>
    </TRPCReactProvider>
  )
}
