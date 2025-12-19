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

interface EventDeclinedEmailProps {
  firstName?: string
  eventTitle?: string
  eventId?: string
  reason?: string
}

export const EventDeclinedEmail = ({
  firstName,
  eventTitle,
  eventId,
  reason,
}: EventDeclinedEmailProps) => {
  const eventUrl = eventId
    ? `https://useticketeur.com/events/${eventId}/edit`
    : 'https://useticketeur.com/events'

  return (
    <EmailContainer
      preview={<Preview>Update required for your event submission</Preview>}
    >
      <Container className="mx-auto px-3">
        <Heading className="font-montserrat my-10 p-0 text-2xl font-bold text-black">
          Action Required: Event Submission
        </Heading>
        <Text className="font-nunito my-6 text-sm text-black">
          Hi {firstName || 'there'},
        </Text>
        <Text className="font-nunito my-6 text-sm text-black">
          Thank you for submitting your event &quot;{eventTitle || 'your event'}&quot; for
          approval. After reviewing your submission, we were unable to approve it
          at this time.
        </Text>
        {reason && (
          <Section className="my-5 rounded-lg border-2 border-solid border-[#dc3545] bg-[#fff5f5] p-5">
            <Text className="font-nunito m-0 text-sm font-bold text-[#dc3545]">
              Reason for Decline:
            </Text>
            <Text className="font-nunito mt-2 mb-0 text-sm text-black">
              {reason}
            </Text>
          </Section>
        )}
        <Text className="font-nunito my-6 text-sm text-black">
          You can update your event details and resubmit it for approval. Please
          address the issues mentioned above and submit again.
        </Text>
        <Text className="font-nunito my-6 text-sm text-black">
          What to do next:
        </Text>
        <Text className="font-nunito my-2 text-sm text-black">
          • Review the reason for decline carefully
        </Text>
        <Text className="font-nunito my-2 text-sm text-black">
          • Update your event details accordingly
        </Text>
        <Text className="font-nunito my-2 text-sm text-black">
          • Resubmit your event for approval
        </Text>
        <Link
          href={eventUrl}
          target="_blank"
          className="text-brand font-jetbrains my-6 block text-sm underline"
        >
          Edit your event
        </Link>
        <Hr className="my-5 border-[#e6ebf1]" />
        <Text className="text-xs leading-4 text-gray-500">
          If you believe this was a mistake or need assistance, please contact
          our support team at support@useticketeur.com
        </Text>
        <Text className="font-jetbrains mt-3 mb-6 text-xs leading-5 text-gray-500">
          Ticketeur - The future of event ticketing.
        </Text>
      </Container>
    </EmailContainer>
  )
}

EventDeclinedEmail.PreviewProps = {
  firstName: 'John',
  eventTitle: 'Tech Conference 2025',
  eventId: '123e4567-e89b-12d3-a456-426614174000',
  reason:
    'The event description does not provide sufficient details about the agenda and schedule. Please add more information about what attendees can expect.',
} as EventDeclinedEmailProps

export default EventDeclinedEmail
