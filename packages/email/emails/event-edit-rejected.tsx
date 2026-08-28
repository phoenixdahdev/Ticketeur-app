import { Container, Heading, Preview, Section, Text } from 'react-email'

import { BRAND_NAME, BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface EventEditRejectedEmailProps {
  organizerName: string
  eventTitle: string
  reason: string
}

export default function EventEditRejectedEmail({
  organizerName = 'Friend',
  eventTitle = 'Your event',
  reason = '',
}: Partial<EventEditRejectedEmailProps>) {
  return (
    <EmailContainer
      preview={
        <Preview>
          Your changes to {eventTitle} weren&apos;t approved
        </Preview>
      }
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          Your changes weren&apos;t approved
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {organizerName},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          We reviewed the edits you submitted for <strong>{eventTitle}</strong>{' '}
          and couldn&apos;t publish them as submitted. Your event is unchanged
          and still live on {BRAND_NAME} — the current version keeps showing.
        </Text>

        {reason ? (
          <Section className="mb-6 rounded-lg bg-gray-50 px-5 py-4">
            <Text className="m-0 text-sm leading-5 text-gray-700">
              <strong>Reason:</strong> {reason}
            </Text>
          </Section>
        ) : null}

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          You can adjust the changes from your organizer dashboard and submit
          them again for review.
        </Text>

        <Text className="m-0 mt-6 text-base leading-6 font-semibold text-gray-800">
          The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

EventEditRejectedEmail.PreviewProps = {
  organizerName: 'Jordan',
  eventTitle: 'Lagos Tech Fest 2026',
  reason: 'The new date clashes with our blackout window — please pick another.',
} satisfies EventEditRejectedEmailProps

export { EventEditRejectedEmail }
