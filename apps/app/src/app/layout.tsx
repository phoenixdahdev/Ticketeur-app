import '@useticketeur/ui/globals.css'
import localFont from 'next/font/local'
import { ReactLenis } from 'lenis/react'
import { cn } from '@useticketeur/ui/lib/utils'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { DefaultProvider } from '@useticketeur/ui/default-provider'

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
          'bg-stone-50 antialiased',
          transformaSans.variable,
          trap.variable
        )}
      >
        <ReactLenis root>
          <NuqsAdapter>
            <DefaultProvider>{children}</DefaultProvider>
          </NuqsAdapter>
        </ReactLenis>
      </body>
    </html>
  )
}
