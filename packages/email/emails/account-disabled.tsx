import {
  Container,
  Heading,
  Preview,
  Section,
  Text,
} from 'react-email'

import { BRAND_NAME, BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface AccountDisabledEmailProps {
  name: string
  reason: string
}

export default function AccountDisabledEmail({
  name = 'Friend',
  reason = '',
}: Partial<AccountDisabledEmailProps>) {
  return (
    <EmailContainer
      preview={<Preview>Your {BRAND_NAME} account has been disabled</Preview>}
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          Your account has been disabled
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {name},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Your {BRAND_NAME} account has been disabled. You will no longer be
          able to sign in, purchase tickets, or list services on the platform.
        </Text>

        {reason ? (
          <Section className="mb-6 rounded-lg bg-gray-50 px-5 py-4">
            <Text className="m-0 text-sm leading-5 text-gray-700">
              <strong>Reason:</strong> {reason}
            </Text>
          </Section>
        ) : null}

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          If you believe this was made in error, reply to this email and our
          team will review your case.
        </Text>

        <Text className="m-0 mt-6 text-base font-semibold leading-6 text-gray-800">
          The {BRAND_NAME_UPPER} Trust &amp; Safety Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

AccountDisabledEmail.PreviewProps = {
  name: 'Alex',
  reason: 'Repeated policy violations',
} satisfies AccountDisabledEmailProps

export { AccountDisabledEmail }
