import type { ReactNode } from 'react'
import { Body, Font, Head, Html, Tailwind } from 'react-email'
import BrandFooter from './brand-footer'
import BrandHeader from './brand-header'
import { BRAND_FONT_BASE } from './brand'

const TRAP_WEIGHTS = [
  { weight: 300, file: 'Trap-Light.woff2' },
  { weight: 400, file: 'Trap-Regular.woff2' },
  { weight: 500, file: 'Trap-Medium.woff2' },
  { weight: 600, file: 'Trap-SemiBold.woff2' },
  { weight: 700, file: 'Trap-Bold.woff2' },
  { weight: 800, file: 'Trap-ExtraBold.woff2' },
  { weight: 900, file: 'Trap-Black.woff2' },
] as const

export default function EmailContainer({
  preview,
  header = <BrandHeader />,
  footer = <BrandFooter />,
  children,
}: {
  preview?: ReactNode
  header?: ReactNode | false
  footer?: ReactNode | false
  children?: ReactNode
}) {
  return (
    <Html>
      <Head>
        {TRAP_WEIGHTS.map(({ weight, file }) => (
          <Font
            key={weight}
            fontFamily="Trap"
            fallbackFontFamily="sans-serif"
            webFont={{
              url: `${BRAND_FONT_BASE}/${file}`,
              format: 'woff2',
            }}
            fontWeight={weight}
            fontStyle="normal"
          />
        ))}
      </Head>
      {preview}
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: {
                  DEFAULT: '#7433FF',
                  dark: '#1A0D42',
                  light: '#F1EBFF',
                },
              },
              fontFamily: {
                sans: ['Trap', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Body className="bg-white font-sans">
          {header === false ? null : header}
          {children}
          {footer === false ? null : footer}
        </Body>
      </Tailwind>
    </Html>
  )
}

export { EmailContainer }
