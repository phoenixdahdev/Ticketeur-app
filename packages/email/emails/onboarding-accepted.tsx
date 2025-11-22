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

interface OnboardingAcceptedEmailProps {
  firstName?: string
  dashboardUrl?: string
}

export const OnboardingAcceptedEmail = ({
  firstName,
  dashboardUrl = 'https://useticketeur.com/dashboard',
}: OnboardingAcceptedEmailProps) => (
  <EmailContainer
    preview={<Preview>Congratulations! Your onboarding has been approved</Preview>}
  >
    <Container className="mx-auto px-3">
      <Heading className="font-montserrat my-10 p-0 text-2xl font-bold text-black">
        Welcome to Ticketeur!
      </Heading>
      <Text className="font-nunito my-6 text-sm text-black">
        Hi {firstName || 'there'},
      </Text>
      <Text className="font-nunito my-6 text-sm text-black">
        Great news! Your onboarding application has been reviewed and approved.
        You now have full access to all Ticketeur features.
      </Text>
      <Section className="my-5 rounded-lg border-2 border-solid border-[#007ee6] bg-[#f8f9fa] p-5 text-center">
        <Text className="font-nunito m-0 text-sm font-bold text-[#007ee6]">
          Your account is now fully verified
        </Text>
      </Section>
      <Text className="font-nunito my-6 text-sm text-black">
        You can now:
      </Text>
      <Text className="font-nunito my-2 text-sm text-black">
        • Create and manage events
      </Text>
      <Text className="font-nunito my-2 text-sm text-black">
        • Sell tickets to your attendees
      </Text>
      <Text className="font-nunito my-2 text-sm text-black">
        • Track sales and analytics
      </Text>
      <Text className="font-nunito my-2 text-sm text-black">
        • Collaborate with your team
      </Text>
      <Link
        href={dashboardUrl}
        target="_blank"
        className="text-brand font-jetbrains my-6 block text-sm underline"
      >
        Go to your dashboard
      </Link>
      <Hr className="my-5 border-[#e6ebf1]" />
      <Text className="text-xs leading-4 text-gray-500">
        If you have any questions or need assistance getting started, our
        support team is here to help.
      </Text>
      <Text className="font-jetbrains mt-3 mb-6 text-xs leading-5 text-gray-500">
        Ticketeur - The future of event ticketing.
      </Text>
    </Container>
  </EmailContainer>
)

OnboardingAcceptedEmail.PreviewProps = {
  firstName: 'John',
  dashboardUrl: 'https://useticketeur.com/dashboard',
} as OnboardingAcceptedEmailProps

export default OnboardingAcceptedEmail
