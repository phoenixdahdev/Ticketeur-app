import localFont from 'next/font/local'

// Shared font definitions for every Ticketeur app. `next/font/local` requires
// its call to be inline (the SWC plugin analyses it statically), so the only
// way to define these once instead of copy-pasting the block into each app's
// root layout is to host the call here — both apps transpile @ticketur/ui, so
// the font loader processes this file at build time.

// Body font. Single variable file spanning the full 200–900 weight range,
// replacing the eight static weights we used to ship.
export const transformaSans = localFont({
  src: './Transforma_Sans/TransformaVariable-Sans.woff2',
  weight: '200 900',
  variable: '--font-transforma-sans',
  display: 'swap',
})

// Heading font. No variable master available, so seven static weights (WOFF2).
export const trap = localFont({
  src: [
    { path: './Trap/Trap-Light.woff2', weight: '300', style: 'normal' },
    { path: './Trap/Trap-Regular.woff2', weight: '400', style: 'normal' },
    { path: './Trap/Trap-Medium.woff2', weight: '500', style: 'normal' },
    { path: './Trap/Trap-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: './Trap/Trap-Bold.woff2', weight: '700', style: 'normal' },
    { path: './Trap/Trap-ExtraBold.woff2', weight: '800', style: 'normal' },
    { path: './Trap/Trap-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-trap',
  display: 'swap',
})
