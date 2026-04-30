import {
  Button,
  Container,
  Heading,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email'

import { BRAND_NAME, BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface EventApprovedEmailProps {
  organizerName: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  publicUrl: string
  manageUrl: string
}

export default function EventApprovedEmail({
  organizerName = 'Friend',
  eventTitle = 'Your event',
  eventDate = '',
  eventLocation = '',
  publicUrl = '#',
  manageUrl = '#',
}: Partial<EventApprovedEmailProps>) {
  return (
    <EmailContainer
      preview={<Preview>{`${eventTitle} is now live on ${BRAND_NAME}`}</Preview>}
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          Your event is live
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {organizerName},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Good news — <strong>{eventTitle}</strong> has been approved and is
          now visible to attendees on {BRAND_NAME}.
        </Text>

        {eventDate || eventLocation ? (
          <Section className="mb-6 rounded-lg bg-gray-50 px-5 py-4">
            {eventDate ? (
              <Row>
                <Text className="m-0 text-sm leading-5 text-gray-700">
                  <strong>Date:</strong> {eventDate}
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
        ) : null}

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Share your event page with your audience and start tracking ticket
          sales from your dashboard.
        </Text>

        <Section className="mb-8">
          <Row>
            <Button
              href={publicUrl}
              className="bg-brand mr-3 inline-block rounded-md px-6 py-3 text-center text-base font-semibold text-white no-underline"
            >
              View event page
            </Button>
            <Button
              href={manageUrl}
              className="inline-block rounded-md border border-gray-300 px-6 py-3 text-center text-base font-semibold text-gray-800 no-underline"
            >
              Manage event
            </Button>
          </Row>
        </Section>

        <Text className="m-0 mt-6 text-base font-semibold leading-6 text-gray-800">
          Cheers,
        </Text>
        <Text className="m-0 text-base font-semibold leading-6 text-gray-800">
          The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

EventApprovedEmail.PreviewProps = {
  organizerName: 'Jordan',
  eventTitle: 'Lagos Tech Fest 2026',
  eventDate: 'Saturday, October 24, 2026',
  eventLocation: 'Eko Convention Centre, Lagos',
  publicUrl: 'https://www.useticketeur.com/events/demo',
  manageUrl: 'https://www.useticketeur.com/org/events/demo',
} satisfies EventApprovedEmailProps

export { EventApprovedEmail }
