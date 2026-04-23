import {
  Button,
  Container,
  Heading,
  Preview,
  Section,
  Text,
} from 'react-email'
import { BRAND_NAME, BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface PasswordResetEmailProps {
  name: string
  resetUrl: string
}

export default function PasswordResetEmail({
  name = 'Alex Johnson',
  resetUrl = 'https://www.useticketeur.com/reset-password?token=abc123',
}: Partial<PasswordResetEmailProps>) {
  return (
    <EmailContainer
      preview={<Preview>Reset your {BRAND_NAME} account password</Preview>}
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="text-brand-dark m-0 mb-4 text-2xl font-bold">
          Reset your password
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {name},
        </Text>

        <Text className="m-0 mb-6 text-base leading-6 text-gray-700">
          We received a request to reset the password for your {BRAND_NAME}{' '}
          account. Click the button below to set a new password.
        </Text>

        <Section className="bg-brand-light border-brand-light mb-6 rounded-lg border border-solid p-6 text-center">
          <Text className="text-brand-dark m-0 mb-4 text-sm leading-5">
            This link will expire in <strong>1 hour</strong>. If you did not
            request a password reset, you can safely ignore this email.
          </Text>
          <Button
            className="bg-brand inline-block rounded-md px-6 py-3 text-center text-base font-semibold text-white no-underline"
            href={resetUrl}
          >
            Reset Password
          </Button>
        </Section>

        <Text className="m-0 mb-2 text-sm leading-5 text-gray-500">
          If the button above doesn&apos;t work, copy and paste this link into
          your browser:
        </Text>
        <Text className="text-brand m-0 mb-6 text-xs leading-5 break-all">
          {resetUrl}
        </Text>

        <Text className="m-0 text-sm leading-5 text-gray-500">
          &mdash; The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

PasswordResetEmail.PreviewProps = {
  name: 'Alex Johnson',
  resetUrl: 'https://www.useticketeur.com/reset-password?token=abc123',
} satisfies PasswordResetEmailProps

export { PasswordResetEmail }
