import './styles.css'
import localFont from 'next/font/local'
import { cn } from '@useticketeur/ui/lib/utils'
import { Toaster } from '@useticketeur/ui/components/sonner'
import { ThemeProvider } from '@useticketeur/ui/theme-provider'
import { FloatingThemeToggle } from '@useticketeur/ui/components/floating-theme-toogle'

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
        className={cn('antialiased', transformaSans.variable, trap.variable)}
      >
        <ThemeProvider defaultTheme="light">
          {children}
          <Toaster />
          <FloatingThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}
