import {
  Container,
  Heading,
  Preview,
  Text,
  Hr,
} from '@react-email/components'
import EmailContainer from '../components/container'

interface OnboardingSubmittedEmailProps {
  firstName?: string
}

export const OnboardingSubmittedEmail = ({
  firstName,
}: OnboardingSubmittedEmailProps) => (
  <EmailContainer
    preview={<Preview>Your onboarding documents have been submitted</Preview>}
  >
    <Container className="mx-auto px-3">
      <Heading className="font-montserrat my-10 p-0 text-2xl font-bold text-black">
        Onboarding Documents Received
      </Heading>
      <Text className="font-nunito my-6 text-sm text-black">
        Hi {firstName || 'there'},
      </Text>
      <Text className="font-nunito my-6 text-sm text-black">
        Thank you for submitting your onboarding documents. We have received
        your application and our team is currently reviewing your information.
      </Text>
      <Text className="font-nunito my-6 text-sm text-black">
        This process typically takes 1-2 business days. We will notify you via
        email once your application has been reviewed.
      </Text>
      <Text className="font-nunito my-6 text-sm text-black">
        In the meantime, you can explore our platform and familiarize yourself
        with our features.
      </Text>
      <Hr className="my-5 border-[#e6ebf1]" />
      <Text className="text-xs leading-4 text-gray-500">
        If you have any questions, please don&apos;t hesitate to reach out to
        our support team.
      </Text>
      <Text className="font-jetbrains mt-3 mb-6 text-xs leading-5 text-gray-500">
        Ticketeur - The future of event ticketing.
      </Text>
    </Container>
  </EmailContainer>
)

OnboardingSubmittedEmail.PreviewProps = {
  firstName: 'John',
} as OnboardingSubmittedEmailProps

export default OnboardingSubmittedEmail
