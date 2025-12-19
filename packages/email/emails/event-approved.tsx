import {
  Container,
  Heading,
  Preview,
  Text,
  Link,
  Section,
  Hr,
} from '@react-email/components'
import EmailContainer from '../components/container'

interface EventApprovedEmailProps {
  firstName?: string
  eventTitle?: string
  eventId?: string
}

export const EventApprovedEmail = ({
  firstName,
  eventTitle,
  eventId,
}: EventApprovedEmailProps) => {
  const eventUrl = eventId
    ? `https://useticketeur.com/events/${eventId}`
    : 'https://useticketeur.com/events'

  return (
    <EmailContainer
      preview={<Preview>Great news! Your event has been approved</Preview>}
    >
      <Container className="mx-auto px-3">
        <Heading className="font-montserrat my-10 p-0 text-2xl font-bold text-black">
          Event Approved!
        </Heading>
        <Text className="font-nunito my-6 text-sm text-black">
          Hi {firstName || 'there'},
        </Text>
        <Text className="font-nunito my-6 text-sm text-black">
          Congratulations! Your event &quot;{eventTitle || 'your event'}&quot; has been
          reviewed and approved by our team.
        </Text>
        <Section className="my-5 rounded-lg border-2 border-solid border-[#28a745] bg-[#f1f9f4] p-5 text-center">
          <Text className="font-nunito m-0 text-sm font-bold text-[#28a745]">
            Your event is now approved and ready to publish
          </Text>
        </Section>
        <Text className="font-nunito my-6 text-sm text-black">
          You can now:
        </Text>
        <Text className="font-nunito my-2 text-sm text-black">
          • Publish your event to make it visible to attendees
        </Text>
        <Text className="font-nunito my-2 text-sm text-black">
          • Start selling tickets
        </Text>
        <Text className="font-nunito my-2 text-sm text-black">
          • Share your event link with your audience
        </Text>
        <Text className="font-nunito my-2 text-sm text-black">
          • Track registrations and ticket sales
        </Text>
        <Link
          href={eventUrl}
          target="_blank"
          className="text-brand font-jetbrains my-6 block text-sm underline"
        >
          View your event
        </Link>
        <Hr className="my-5 border-[#e6ebf1]" />
        <Text className="text-xs leading-4 text-gray-500">
          If you have any questions or need assistance, our support team is here
          to help.
        </Text>
        <Text className="font-jetbrains mt-3 mb-6 text-xs leading-5 text-gray-500">
          Ticketeur - The future of event ticketing.
        </Text>
      </Container>
    </EmailContainer>
  )
}

EventApprovedEmail.PreviewProps = {
  firstName: 'John',
  eventTitle: 'Tech Conference 2025',
  eventId: '123e4567-e89b-12d3-a456-426614174000',
} as EventApprovedEmailProps

export default EventApprovedEmail
