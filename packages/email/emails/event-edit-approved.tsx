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

interface EventEditApprovedEmailProps {
  organizerName: string
  eventTitle: string
  publicUrl: string
  manageUrl: string
}

export default function EventEditApprovedEmail({
  organizerName = 'Friend',
  eventTitle = 'Your event',
  publicUrl = '#',
  manageUrl = '#',
}: Partial<EventEditApprovedEmailProps>) {
  return (
    <EmailContainer
      preview={
        <Preview>{`Your changes to ${eventTitle} are now live`}</Preview>
      }
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          Your changes are live
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {organizerName},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          The edits you submitted for <strong>{eventTitle}</strong> have been
          approved and are now showing on {BRAND_NAME}.
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

        <Text className="m-0 mt-6 text-base leading-6 font-semibold text-gray-800">
          Cheers,
        </Text>
        <Text className="m-0 text-base leading-6 font-semibold text-gray-800">
          The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

EventEditApprovedEmail.PreviewProps = {
  organizerName: 'Jordan',
  eventTitle: 'Lagos Tech Fest 2026',
  publicUrl: 'https://www.useticketeur.com/events/demo',
  manageUrl: 'https://www.useticketeur.com/org/events/demo',
} satisfies EventEditApprovedEmailProps

export { EventEditApprovedEmail }
