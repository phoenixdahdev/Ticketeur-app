import './styles.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { cn } from '@useticketeur/ui/lib/utils'
import { Toaster } from '@useticketeur/ui/sonner'
import { ThemeProvider } from '@useticketeur/ui/theme-provider'
import { FloatingThemeToggle } from '@useticketeur/ui/floating-theme-toogle'

export const metadata: Metadata = {
  title: 'Ticketeur: One App, Endless Events',
  description:
    'From booking tickets to managing events, Ticketeur is your comprehensive, easy-to-use platform for all event experiences.',
  keywords: ['events', 'tickets', 'event management', 'booking'],
  authors: [{ name: '@useticketeur-team' }],
  openGraph: {
    title: 'Ticketeur: One App, Endless Events',
    description:
      'From booking tickets to managing events, Ticketeur is your comprehensive, easy-to-use platform for all event experiences.',
    url: 'https://useticketeur.com',
    siteName: 'Ticketeur',
    images: [
      {
        url: '/og-image.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ticketeur: One App, Endless Events',
    description:
      'From booking tickets to managing events, Ticketeur is your comprehensive, easy-to-use platform for all event experiences.',
    images: ['/og-image.png'],
  },
}

const transformaSans = localFont({
  src: [
    {
      path: '../../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Extralight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Transforma_Sans/TransformaSans_Trial-Black.ttf',
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
      path: '../../../../packages/ui/src/fonts/Trap/Trap-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Trap/Trap-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Trap/Trap-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Trap/Trap-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Trap/Trap-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Trap/Trap-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../../../packages/ui/src/fonts/Trap/Trap-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-trap',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background antialiased',
          transformaSans.variable,
          trap.variable
        )}
      >
        <ThemeProvider defaultTheme="light">
          <header>
            <Navbar />
          </header>
          {children}
          <FloatingThemeToggle />
          <Footer />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
