import {
  Container,
  Heading,
  Preview,
  Text,
  Link,
  Section,
  Hr,
  Button,
} from '@react-email/components'
import EmailContainer from '../components/container'

interface EventApprovalRequestEmailProps {
  eventName?: string
  eventDate?: string
  organizerName?: string
  organizerEmail?: string
  eventDescription?: string
  approvalUrl?: string
}

export const EventApprovalRequestEmail = ({
  eventName = 'New Event',
  eventDate,
  organizerName = 'Event Organizer',
  organizerEmail = 'organizer@example.com',
  eventDescription,
  approvalUrl = 'https://useticketeur.com/admin/events',
}: EventApprovalRequestEmailProps) => (
  <EmailContainer
    preview={
      <Preview>
        New event submitted for approval: {eventName}
      </Preview>
    }
  >
    <Container className="mx-auto px-3">
      <Heading className="font-montserrat my-10 p-0 text-2xl font-bold text-black">
        New Event Awaiting Approval
      </Heading>
      <Text className="font-nunito my-6 text-sm text-black">
        Hi Admin,
      </Text>
      <Text className="font-nunito my-6 text-sm text-black">
        A new event has been submitted for approval on Ticketeur. Please review
        the details below and take appropriate action.
      </Text>
      <Section className="my-5 rounded-lg border-2 border-solid border-[#007ee6] bg-[#f8f9fa] p-5">
        <Text className="font-nunito m-0 text-lg font-bold text-[#007ee6]">
          {eventName}
        </Text>
        {eventDate && (
          <Text className="font-nunito m-0 mt-2 text-sm text-gray-600">
            Date: {eventDate}
          </Text>
        )}
        {eventDescription && (
          <Text className="font-nunito m-0 mt-2 text-sm text-gray-600">
            {eventDescription.length > 200
              ? `${eventDescription.substring(0, 200)}...`
              : eventDescription}
          </Text>
        )}
      </Section>
      <Text className="font-nunito my-6 text-sm text-black">
        <strong>Organizer Details:</strong>
      </Text>
      <Text className="font-nunito my-2 text-sm text-black">
        Name: {organizerName}
      </Text>
      <Text className="font-nunito my-2 text-sm text-black">
        Email: {organizerEmail}
      </Text>
      <Section className="my-8 text-center">
        <Button
          href={approvalUrl}
          className="rounded-md bg-[#1954EC] px-6 py-3 text-sm font-semibold text-white"
        >
          Review Event
        </Button>
      </Section>
      <Hr className="my-5 border-[#e6ebf1]" />
      <Text className="text-xs leading-4 text-gray-500">
        This is an automated notification from Ticketeur. Please review and
        approve or decline the event at your earliest convenience.
      </Text>
      <Text className="font-jetbrains mt-3 mb-6 text-xs leading-5 text-gray-500">
        Ticketeur - The future of event ticketing.
      </Text>
    </Container>
  </EmailContainer>
)

EventApprovalRequestEmail.PreviewProps = {
  eventName: 'Tech Conference 2025',
  eventDate: 'January 15, 2025',
  organizerName: 'John Doe',
  organizerEmail: 'john@example.com',
  eventDescription:
    'A premier technology conference bringing together industry leaders and innovators.',
  approvalUrl: 'https://useticketeur.com/admin/events/123',
} as EventApprovalRequestEmailProps

export default EventApprovalRequestEmail
