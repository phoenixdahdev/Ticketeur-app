import {
  Button,
  Container,
  Heading,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email'

import {
  BRAND_NAME,
  BRAND_NAME_UPPER,
  BRAND_URL,
} from '../components/brand'
import EmailContainer from '../components/container'

interface AccountReactivatedEmailProps {
  name: string
}

export default function AccountReactivatedEmail({
  name = 'Friend',
}: Partial<AccountReactivatedEmailProps>) {
  return (
    <EmailContainer
      preview={<Preview>Your {BRAND_NAME} account is active again</Preview>}
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          Welcome back
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {name},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Good news — your {BRAND_NAME} account has been reactivated. You can
          sign in again and pick up right where you left off.
        </Text>

        <Section className="mb-8">
          <Row>
            <Button
              href={`${BRAND_URL}/login`}
              className="bg-brand inline-block rounded-md px-6 py-3 text-center text-base font-semibold text-white no-underline"
            >
              Sign in to {BRAND_NAME}
            </Button>
          </Row>
        </Section>

        <Text className="m-0 mt-6 text-base font-semibold leading-6 text-gray-800">
          The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

AccountReactivatedEmail.PreviewProps = {
  name: 'Alex',
} satisfies AccountReactivatedEmailProps

export { AccountReactivatedEmail }
