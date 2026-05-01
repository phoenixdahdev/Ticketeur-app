import {
  Container,
  Heading,
  Preview,
  Text,
} from 'react-email'

import { BRAND_NAME, BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface AccountRemovedEmailProps {
  name: string
}

export default function AccountRemovedEmail({
  name = 'Friend',
}: Partial<AccountRemovedEmailProps>) {
  return (
    <EmailContainer
      preview={<Preview>Your {BRAND_NAME} account has been removed</Preview>}
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          Your account has been removed
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {name},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          We&apos;re writing to let you know that your {BRAND_NAME} account has
          been permanently removed. All associated sessions, tickets, and
          dashboards have been deactivated.
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          If this was unexpected, please reply to this email so we can
          investigate.
        </Text>

        <Text className="m-0 mt-6 text-base font-semibold leading-6 text-gray-800">
          The {BRAND_NAME_UPPER} Trust &amp; Safety Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

AccountRemovedEmail.PreviewProps = {
  name: 'Alex',
} satisfies AccountRemovedEmailProps

export { AccountRemovedEmail }
