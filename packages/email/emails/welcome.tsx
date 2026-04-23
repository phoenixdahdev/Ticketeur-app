import {
  Button,
  Column,
  Container,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email'
import {
  BRAND_EMAIL_ASSETS,
  BRAND_NAME,
  BRAND_NAME_UPPER,
  BRAND_URL,
} from '../components/brand'
import EmailContainer from '../components/container'

interface WelcomeEmailProps {
  name: string
  actionUrl?: string
}

export default function WelcomeEmail({
  name = 'Alex',
  actionUrl = `${BRAND_URL}/dashboard`,
}: Partial<WelcomeEmailProps>) {
  return (
    <EmailContainer preview={<Preview>Welcome to {BRAND_NAME}</Preview>}>
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Section className="mb-8">
          <Img
            src={`${BRAND_EMAIL_ASSETS}/welcome-hero.png`}
            width="520"
            height="168"
            alt={`Welcome to ${BRAND_NAME}`}
            className="block w-full rounded-lg"
          />
        </Section>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {name},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Welcome to {BRAND_NAME_UPPER}, your trusted place to discover events,
          connect with vendors, and create unforgettable experiences.
        </Text>

        <Text className="m-0 mb-2 text-base leading-6 text-gray-700">
          You can now:
        </Text>

        <ul className="m-0 mt-0 mb-4 pl-6 text-base leading-7 text-gray-700">
          <li>Explore upcoming events</li>
          <li>Purchase tickets easily and securely</li>
          <li>
            Create and manage your own events (if you&apos;re an organizer)
          </li>
          <li>
            Showcase your business to event audiences (if you&apos;re a vendor)
          </li>
        </ul>

        <Text className="m-0 mb-6 text-base leading-6 text-gray-700">
          We&apos;re excited to have you on board.
        </Text>

        <Section className="mb-8">
          <Row>
            <Column
              align="left"
              valign="middle"
              className="text-base leading-6 text-gray-700"
            >
              👉 Get Started here:
            </Column>
            <Column align="right" valign="middle">
              <Button
                href={actionUrl}
                className="bg-brand inline-block rounded-md px-6 py-3 text-center text-base font-semibold text-white no-underline"
              >
                Get Started
              </Button>
            </Column>
          </Row>
        </Section>

        <Text className="m-0 mb-8 text-base leading-6 text-gray-700">
          If you have any questions, feel free to reach out &mdash; we&apos;re
          here to help.
        </Text>

        <Text className="m-0 text-base font-semibold leading-6 text-gray-800">
          Welcome again,
        </Text>
        <Text className="m-0 text-base font-semibold leading-6 text-gray-800">
          The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

WelcomeEmail.PreviewProps = {
  name: 'Alex',
} satisfies WelcomeEmailProps

export { WelcomeEmail }
