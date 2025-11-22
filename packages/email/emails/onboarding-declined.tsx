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

interface OnboardingDeclinedEmailProps {
  firstName?: string
  reason?: string
  supportUrl?: string
}

export const OnboardingDeclinedEmail = ({
  firstName,
  reason,
  supportUrl = 'https://useticketeur.com/support',
}: OnboardingDeclinedEmailProps) => (
  <EmailContainer
    preview={<Preview>Update required for your Ticketeur application</Preview>}
  >
    <Container className="mx-auto px-3">
      <Heading className="font-montserrat my-10 p-0 text-2xl font-bold text-black">
        Action Required: Onboarding Application
      </Heading>
      <Text className="font-nunito my-6 text-sm text-black">
        Hi {firstName || 'there'},
      </Text>
      <Text className="font-nunito my-6 text-sm text-black">
        Thank you for your interest in becoming a Ticketeur organizer. After
        reviewing your application, we were unable to approve it at this time.
      </Text>
      {reason && (
        <Section className="my-5 rounded-lg border-2 border-solid border-[#dc3545] bg-[#fff5f5] p-5">
          <Text className="font-nunito m-0 text-sm font-bold text-[#dc3545]">
            Reason:
          </Text>
          <Text className="font-nunito mt-2 mb-0 text-sm text-black">
            {reason}
          </Text>
        </Section>
      )}
      <Text className="font-nunito my-6 text-sm text-black">
        You can update your application and resubmit the required documents. If
        you believe this was a mistake or need assistance, please contact our
        support team.
      </Text>
      <Link
        href={supportUrl}
        target="_blank"
        className="text-brand font-jetbrains my-6 block text-sm underline"
      >
        Contact Support
      </Link>
      <Hr className="my-5 border-[#e6ebf1]" />
      <Text className="text-xs leading-4 text-gray-500">
        We appreciate your understanding and look forward to reviewing your
        updated application.
      </Text>
      <Text className="font-jetbrains mt-3 mb-6 text-xs leading-5 text-gray-500">
        Ticketeur - The future of event ticketing.
      </Text>
    </Container>
  </EmailContainer>
)

OnboardingDeclinedEmail.PreviewProps = {
  firstName: 'John',
  reason: 'The uploaded identification document was not clearly visible.',
  supportUrl: 'https://useticketeur.com/support',
} as OnboardingDeclinedEmailProps

export default OnboardingDeclinedEmail
