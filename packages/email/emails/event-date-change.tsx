import {
  Button,
  Container,
  Heading,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email'

import { BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface EventDateChangeEmailProps {
  firstName: string
  eventTitle: string
  previousDate: string
  newDate: string
  eventTime: string
  eventLocation: string
  eventUrl: string
}

export default function EventDateChangeEmail({
  firstName = 'there',
  eventTitle = 'Your event',
  previousDate = '',
  newDate = '',
  eventTime = '',
  eventLocation = '',
  eventUrl = '#',
}: Partial<EventDateChangeEmailProps>) {
  return (
    <EmailContainer
      preview={
        <Preview>{`New date for ${eventTitle} — your ticket is still valid`}</Preview>
      }
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Text className="text-brand m-0 mb-2 text-xs font-bold uppercase tracking-widest">
          🛎️ Special announcement
        </Text>
        <Heading className="m-0 mb-4 text-2xl font-bold uppercase tracking-wide text-gray-900">
          The date has changed
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {firstName},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          The date for <strong>{eventTitle}</strong> has been updated. Please
          note the new date below — <strong>your ticket stays valid</strong>,
          so there&apos;s nothing you need to do.
        </Text>

        <Section className="bg-brand-light mb-6 rounded-lg px-5 py-4">
          {previousDate ? (
            <Row>
              <Text className="m-0 text-sm leading-5 text-gray-500 line-through">
                Previously: {previousDate}
              </Text>
            </Row>
          ) : null}
          <Row>
            <Text className="text-brand-dark m-0 mt-1 text-base font-bold leading-6">
              New date: {newDate}
            </Text>
          </Row>
          {eventTime ? (
            <Row>
              <Text className="m-0 mt-1 text-sm leading-5 text-gray-700">
                <strong>Time:</strong> {eventTime}
              </Text>
            </Row>
          ) : null}
          {eventLocation ? (
            <Row>
              <Text className="m-0 mt-1 text-sm leading-5 text-gray-700">
                <strong>Location:</strong> {eventLocation}
              </Text>
            </Row>
          ) : null}
        </Section>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Everything else stays the same. You can review the event details any
          time using the button below.
        </Text>

        <Section className="mb-8">
          <Row>
            <Button
              href={eventUrl}
              className="bg-brand inline-block rounded-md px-6 py-3 text-center text-base font-semibold text-white no-underline"
            >
              View event details
            </Button>
          </Row>
        </Section>

        <Text className="m-0 text-base leading-6 text-gray-700">
          Sorry for any inconvenience, and thanks for your understanding — we
          can&apos;t wait to see you there.
        </Text>

        <Text className="m-0 mt-6 text-base font-semibold leading-6 text-gray-800">
          See you soon,
        </Text>
        <Text className="m-0 text-base font-semibold leading-6 text-gray-800">
          The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

EventDateChangeEmail.PreviewProps = {
  firstName: 'Phoenix',
  eventTitle: 'The Crowd Concert',
  previousDate: 'Friday, July 10, 2026',
  newDate: 'Friday, July 24, 2026',
  eventTime: '12:00',
  eventLocation: 'Lagos, Nigeria',
  eventUrl: 'https://www.useticketeur.com/events/the-crowd-concert',
} satisfies EventDateChangeEmailProps

export { EventDateChangeEmail }
