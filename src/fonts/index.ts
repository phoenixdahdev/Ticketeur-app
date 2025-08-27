import { Inter, Montserrat, Nunito } from 'next/font/google'

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
