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

interface EventInvitationEmailProps {
  inviterName?: string
  inviteeName?: string
  eventName?: string
  eventDate?: string
  role?: string
  acceptUrl?: string
  declineUrl?: string
}

export const EventInvitationEmail = ({
  inviterName = 'Team Member',
  inviteeName = 'there',
  eventName = 'Awesome Event',
  eventDate,
  role = 'staff',
  acceptUrl = 'https://useticketeur.com/invite/accept',
  declineUrl = 'https://useticketeur.com/invite/decline',
}: EventInvitationEmailProps) => (
  <EmailContainer
    preview={
      <Preview>
        You&apos;ve been invited to join {eventName} on Ticketeur
      </Preview>
    }
  >
    <Container className="mx-auto px-3">
      <Heading className="font-montserrat my-10 p-0 text-2xl font-bold text-black">
        You&apos;re Invited!
      </Heading>
      <Text className="font-nunito my-6 text-sm text-black">
        Hi {inviteeName},
      </Text>
      <Text className="font-nunito my-6 text-sm text-black">
        {inviterName} has invited you to join the event team for{' '}
        <strong>{eventName}</strong> on Ticketeur.
      </Text>
      <Section className="my-5 rounded-lg border-2 border-solid border-[#007ee6] bg-[#f8f9fa] p-5 text-center">
        <Text className="font-nunito m-0 text-sm font-bold text-[#007ee6]">
          Your role: {role.charAt(0).toUpperCase() + role.slice(1)}
        </Text>
        {eventDate && (
          <Text className="font-nunito m-0 mt-2 text-xs text-gray-600">
            Event date: {eventDate}
          </Text>
        )}
      </Section>
      <Text className="font-nunito my-6 text-sm text-black">
        As a team member, you&apos;ll be able to:
      </Text>
      <Text className="font-nunito my-2 text-sm text-black">
        - Help manage the event
      </Text>
      <Text className="font-nunito my-2 text-sm text-black">
        - Access event dashboard and analytics
      </Text>
      <Text className="font-nunito my-2 text-sm text-black">
        - Collaborate with other team members
      </Text>
      <Section className="my-8 text-center">
        <Button
          href={acceptUrl}
          className="rounded-md bg-[#1954EC] px-6 py-3 text-sm font-semibold text-white"
        >
          Accept Invitation
        </Button>
      </Section>
      <Text className="font-nunito my-4 text-center text-xs text-gray-500">
        or{' '}
        <Link
          href={declineUrl}
          className="text-gray-600 underline"
        >
          decline this invitation
        </Link>
      </Text>
      <Hr className="my-5 border-[#e6ebf1]" />
      <Text className="text-xs leading-4 text-gray-500">
        This invitation will expire in 7 days. If you didn&apos;t expect this
        invitation, you can safely ignore this email.
      </Text>
      <Text className="font-jetbrains mt-3 mb-6 text-xs leading-5 text-gray-500">
        Ticketeur - The future of event ticketing.
      </Text>
    </Container>
  </EmailContainer>
)

EventInvitationEmail.PreviewProps = {
  inviterName: 'John Doe',
  inviteeName: 'Jane',
  eventName: 'Tech Conference 2025',
  eventDate: 'January 15, 2025',
  role: 'coordinator',
  acceptUrl: 'https://useticketeur.com/invite/accept?token=abc123',
  declineUrl: 'https://useticketeur.com/invite/decline?token=abc123',
} as EventInvitationEmailProps

export default EventInvitationEmail
