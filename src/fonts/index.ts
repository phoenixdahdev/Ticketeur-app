import { Inter, Montserrat, Nunito } from 'next/font/google'
import localFont from 'next/font/local'

export const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'vietnamese'],
  display: 'auto',
  variable: '--font-montserrat',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const inter = Inter({
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

export const nunito = Nunito({
  subsets: [
    'latin',
    'cyrillic',
    'cyrillic-ext',
    'latin',
    'vietnamese',
    'latin-ext',
  ],
  display: 'swap',
  variable: '--font-nunito',
})

export const trap = localFont({
  src: [
    { path: '../fonts/Trap/Trap-Light.otf', weight: '300', style: 'normal' },
    { path: '../fonts/Trap/Trap-Regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/Trap/Trap-Medium.otf', weight: '500', style: 'normal' },
    { path: '../fonts/Trap/Trap-SemiBold.otf', weight: '600', style: 'normal' },
    { path: '../fonts/Trap/Trap-Bold.otf', weight: '700', style: 'normal' },
    {
      path: '../fonts/Trap/Trap-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    { path: '../fonts/Trap/Trap-Black.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-trap',
  weight: '300 400 500 600 700 800 900',
  display: 'swap',
})

export const transforma = localFont({
  src: [
    {
      path: '../fonts/Transforma_Sans/TransformaVariable-Sans.ttf',
      style: 'normal',
      weight: '100',
    },
    {
      path: '../fonts/Transforma_Sans/TransformaSans_Trial-Extralight.ttf',
      style: 'normal',
      weight: '200',
    },
    {
      path: '../fonts/Transforma_Sans/TransformaSans_Trial-Light.ttf',
      style: 'normal',
      weight: '300',
    },
    {
      path: '../fonts/Transforma_Sans/TransformaSans_Trial-Regular.ttf',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../fonts/Transforma_Sans/TransformaSans_Trial-Medium.ttf',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../fonts/Transforma_Sans/TransformaSans_Trial-SemiBold.ttf',
      style: 'normal',
      weight: '600',
    },
    {
      path: '../fonts/Transforma_Sans/TransformaSans_Trial-Bold.ttf',
      style: 'normal',
      weight: '700',
    },
    {
      path: '../fonts/Transforma_Sans/TransformaSans_Trial-ExtraBold.ttf',
      style: 'normal',
      weight: '800',
    },
    {
      path: '../fonts/Transforma_Sans/TransformaSans_Trial-Black.ttf',
      style: 'normal',
      weight: '900',
    },
    {
      path: '../fonts/Transforma_Sans/TransformaSans_Trial-ExtraBlack.ttf',
      style: 'normal',
      weight: '950',
    },
  ],
  variable: '--font-transforma-sans',
  weight: '100 200 300 400 500 600 700 800 900 950',
  display: 'swap',
})
