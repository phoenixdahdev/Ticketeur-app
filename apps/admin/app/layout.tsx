import './globals.css'
import type { Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { DefaultProvider } from '@ticketur/ui/providers/default-provider'
import { transformaSans, trap } from '@ticketur/ui/fonts'
import { cn } from '@ticketur/ui/lib/utils'

export const metadata: Metadata = {
  title: {
    default: 'Ticketeur Admin',
    template: '%s | Ticketeur Admin',
  },
  description: 'Ticketeur Admin Dashboard',
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          'font-sans antialiased',
          transformaSans.variable,
          trap.variable
        )}
      >
        <NuqsAdapter>
          <DefaultProvider
            useLens={false}
            trpcUrl="/api/trpc"
            defaultTheme="light"
          >
            {children}
          </DefaultProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
