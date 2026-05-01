import {
  Container,
  Heading,
  Preview,
  Section,
  Text,
} from 'react-email'

import { BRAND_NAME, BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface EventRejectedEmailProps {
  organizerName: string
  eventTitle: string
  reason: string
}

export default function EventRejectedEmail({
  organizerName = 'Friend',
  eventTitle = 'Your event',
  reason = '',
}: Partial<EventRejectedEmailProps>) {
  return (
    <EmailContainer
      preview={
        <Preview>{eventTitle} wasn&apos;t approved on {BRAND_NAME}</Preview>
      }
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          Your event wasn&apos;t approved
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {organizerName},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          We reviewed <strong>{eventTitle}</strong> and we&apos;re unable to
          publish it on {BRAND_NAME} as submitted. The event has been moved
          back to drafts so you can update and resubmit it.
        </Text>

        {reason ? (
          <Section className="mb-6 rounded-lg bg-gray-50 px-5 py-4">
            <Text className="m-0 text-sm leading-5 text-gray-700">
              <strong>Reason:</strong> {reason}
            </Text>
          </Section>
        ) : null}

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          You can edit the event from your organizer dashboard and submit it
          again for review.
        </Text>

        <Text className="m-0 mt-6 text-base font-semibold leading-6 text-gray-800">
          The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

EventRejectedEmail.PreviewProps = {
  organizerName: 'Jordan',
  eventTitle: 'Lagos Tech Fest 2026',
  reason: 'Banner image is too low resolution to display in our hero layout.',
} satisfies EventRejectedEmailProps

export { EventRejectedEmail }
