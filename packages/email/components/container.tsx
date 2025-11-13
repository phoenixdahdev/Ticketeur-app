import {
  Font,
  Head,
  Html,
  Tailwind,
  pixelBasedPreset,
  Body,
} from '@react-email/components'
// import Footer from './footer'
// import { Logo } from './logo'

const EmailContainer = ({
  children,
  preview,
  additionalHeadContent,
}: {
  children: React.ReactNode
  preview?: React.ReactNode
  additionalHeadContent?: React.ReactNode
}) => {
  return (
    <Html>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: '#1954EC',
              },
              fontFamily: {
                nunito: ['Nunito', 'Helvetica', 'sans-serif'],
                montserrat: ['Montserrat', 'Helvetica', 'sans-serif'],
                jetbrains: ['JetBrains Mono', 'monospace'],
              },
            },
          },
        }}
      >
        <Head>
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />

          {/* Nunito */}
          <Font
            fontFamily="Nunito"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: 'https://fonts.gstatic.com/s/nunito/v25/XRXV3I6Li01BKofIOOaBTMnFcQ.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Nunito"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: 'https://fonts.gstatic.com/s/nunito/v25/XRXW3I6Li01BKofIMPY.woff2',
              format: 'woff2',
            }}
            fontWeight={700}
            fontStyle="normal"
          />

          {/* Montserrat */}
          <Font
            fontFamily="Montserrat"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Montserrat"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2',
              format: 'woff2',
            }}
            fontWeight={700}
            fontStyle="normal"
          />

          {/* JetBrains Mono */}
          <Font
            fontFamily="JetBrains Mono"
            fallbackFontFamily="monospace"
            webFont={{
              url: 'https://fonts.gstatic.com/s/jetbrainsmono/v13/t1Z7IRo4d1wQ1pU5q5R3WhTnYI3b5e8y.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="JetBrains Mono"
            fallbackFontFamily="monospace"
            webFont={{
              url: 'https://fonts.gstatic.com/s/jetbrainsmono/v13/t1Z7IRo4d1wQ1pU5q5R3WhTnYI3b5e8y.woff2',
              format: 'woff2',
            }}
            fontWeight={700}
            fontStyle="normal"
          />

          {additionalHeadContent}
        </Head>

        {preview}

        <Body className="font-jetbrains mx-auto my-auto max-w-[600px] bg-white px-2 font-medium text-black">
          {/* <Logo /> */}
          {children}
          {/* <Footer /> */}
        </Body>
      </Tailwind>
    </Html>
  )
}

export default EmailContainer
