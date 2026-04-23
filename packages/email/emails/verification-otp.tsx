import { Container, Heading, Preview, Section, Text } from 'react-email'
import { BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface VerificationOTPEmailProps {
  otp: string
  type: 'email-verification' | 'sign-in' | 'forget-password'
}

const TYPE_COPY = {
  'email-verification': {
    subject: 'Verify your email',
    heading: 'Verify your email',
    description: 'Enter this code to verify your email address.',
  },
  'sign-in': {
    subject: 'Your sign-in code',
    heading: 'Sign in code',
    description: 'Enter this code to sign in to your account.',
  },
  'forget-password': {
    subject: 'Password reset code',
    heading: 'Reset your password',
    description: 'Enter this code to reset your password.',
  },
} as const

export default function VerificationOTPEmail({
  otp = '482916',
  type = 'email-verification',
}: Partial<VerificationOTPEmailProps>) {
  const msg = TYPE_COPY[type]

  return (
    <EmailContainer preview={<Preview>{msg.subject}</Preview>}>
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="text-brand-dark m-0 mb-4 text-2xl font-bold">
          {msg.heading}
        </Heading>

        <Text className="m-0 mb-6 text-base leading-6 text-gray-700">
          {msg.description}
        </Text>

        <Section className="bg-brand-light border-brand-light mb-6 rounded-lg border border-solid p-6 text-center">
          <Text className="text-brand m-0 font-mono text-4xl font-bold tracking-widest">
            {otp}
          </Text>
          <Text className="text-brand-dark m-0 mt-3 text-sm leading-5">
            This code expires in <strong>10 minutes</strong>.
          </Text>
        </Section>

        <Text className="m-0 mb-4 text-sm leading-5 text-gray-500">
          If you didn&apos;t request this code, you can safely ignore this
          email.
        </Text>

        <Text className="m-0 text-sm leading-5 text-gray-500">
          &mdash; The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

VerificationOTPEmail.PreviewProps = {
  otp: '482916',
  type: 'email-verification',
} satisfies VerificationOTPEmailProps

export { VerificationOTPEmail }
