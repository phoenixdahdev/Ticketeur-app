import { Container, Heading, Preview, Section, Text } from 'react-email'
import { BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface TwoFactorOTPEmailProps {
  otp: string
}

export default function TwoFactorOTPEmail({
  otp = '384729',
}: Partial<TwoFactorOTPEmailProps>) {
  return (
    <EmailContainer
      preview={<Preview>Your two-factor authentication code</Preview>}
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="text-brand-dark m-0 mb-4 text-2xl font-bold">
          Two-factor authentication
        </Heading>

        <Text className="m-0 mb-6 text-base leading-6 text-gray-700">
          Use the following code to complete your sign-in:
        </Text>

        <Section className="bg-brand-light border-brand-light mb-6 rounded-lg border border-solid p-6 text-center">
          <Text className="text-brand m-0 font-mono text-4xl font-bold tracking-widest">
            {otp}
          </Text>
          <Text className="text-brand-dark m-0 mt-3 text-sm leading-5">
            This code expires in <strong>5 minutes</strong>.
          </Text>
        </Section>

        <Text className="m-0 mb-4 text-sm leading-5 text-gray-500">
          If you didn&apos;t attempt to sign in, please secure your account
          immediately.
        </Text>

        <Text className="m-0 text-sm leading-5 text-gray-500">
          &mdash; The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

TwoFactorOTPEmail.PreviewProps = {
  otp: '384729',
} satisfies TwoFactorOTPEmailProps

export { TwoFactorOTPEmail }
