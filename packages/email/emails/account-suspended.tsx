import {
  Container,
  Heading,
  Preview,
  Section,
  Text,
} from 'react-email'

import { BRAND_NAME, BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface AccountSuspendedEmailProps {
  name: string
  reason: string
  expiresAt: string | null
}

export default function AccountSuspendedEmail({
  name = 'Friend',
  reason = '',
  expiresAt = null,
}: Partial<AccountSuspendedEmailProps>) {
  return (
    <EmailContainer
      preview={<Preview>Your {BRAND_NAME} account has been suspended</Preview>}
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          Your account has been suspended
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {name},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Your {BRAND_NAME} account has been temporarily suspended by our team.
          During this period you won&apos;t be able to sign in, purchase
          tickets, or access your dashboard.
        </Text>

        {reason || expiresAt ? (
          <Section className="mb-6 rounded-lg bg-gray-50 px-5 py-4">
            {reason ? (
              <Text className="m-0 text-sm leading-5 text-gray-700">
                <strong>Reason:</strong> {reason}
              </Text>
            ) : null}
            {expiresAt ? (
              <Text className="m-0 mt-1 text-sm leading-5 text-gray-700">
                <strong>Suspension ends:</strong> {expiresAt}
              </Text>
            ) : null}
          </Section>
        ) : null}

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          If you believe this was a mistake or you want to appeal, reply to
          this email and our team will get back to you.
        </Text>

        <Text className="m-0 mt-6 text-base font-semibold leading-6 text-gray-800">
          The {BRAND_NAME_UPPER} Trust &amp; Safety Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

AccountSuspendedEmail.PreviewProps = {
  name: 'Alex',
  reason: 'Multiple violations of our community guidelines',
  expiresAt: 'May 31, 2026',
} satisfies AccountSuspendedEmailProps

export { AccountSuspendedEmail }
