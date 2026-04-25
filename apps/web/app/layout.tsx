import './globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { DefaultProvider } from '@ticketur/ui/providers/default-provider'
import { cn } from '@ticketur/ui/lib/utils'

export const metadata: Metadata = {
  title: {
    default: 'Ticketeur',
    template: '%s | Ticketeur',
  },
  description: 'Ticketeur',
  icons: {
    icon: '/logo.svg',
  },
}

const transformaSans = localFont({
  src: [
    {
      path: '../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Extralight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-transforma-sans',
  display: 'swap',
})

const trap = localFont({
  src: [
    {
      path: '../../../packages/ui/src/fonts/Trap/Trap-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Trap/Trap-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Trap/Trap-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Trap/Trap-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Trap/Trap-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Trap/Trap-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../../packages/ui/src/fonts/Trap/Trap-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-trap',
  display: 'swap',
})

const inter = Inter({
  subsets: [
    'latin',
    'latin-ext',
    'cyrillic',
    'cyrillic-ext',
    'greek',
    'vietnamese',
    'greek-ext',
  ],
  display: 'auto',
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

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
          trap.variable,
          inter.variable
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
