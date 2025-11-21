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

interface OnboardingResponseEmailProps {
  userName: string
  userEmail: string
  userId: string
  documents: string[]
  verificationUrl: string
}

export const OnboardingResponseEmail = ({
  userName,
  userEmail,
  userId,
  documents,
  verificationUrl,
}: OnboardingResponseEmailProps) => (
  <EmailContainer
    preview={<Preview>New onboarding response from {userName}</Preview>}
  >
    <Container className="mx-auto px-3">
      <Heading className="font-montserrat my-10 p-0 text-2xl font-bold text-black">
        New Onboarding Response
      </Heading>
      <Text className="font-nunito my-6 text-sm text-black">
        A new user has completed their onboarding process and is awaiting
        review.
      </Text>

      <Hr className="my-5 border-[#e6ebf1]" />

      <Section className="my-5">
        <Text className="font-montserrat mb-3 text-base font-bold text-black">
          User Information
        </Text>
        <Text className="font-nunito my-2 text-sm text-black">
          <strong>Name:</strong> {userName}
        </Text>
        <Text className="font-nunito my-2 text-sm text-black">
          <strong>Email:</strong> {userEmail}
        </Text>
        <Text className="font-nunito my-2 text-sm text-black">
          <strong>User ID:</strong> {userId}
        </Text>
      </Section>

      <Hr className="my-5 border-[#e6ebf1]" />

      <Section className="my-5">
        <Text className="font-montserrat mb-3 text-base font-bold text-black">
          Submitted Documents
        </Text>
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <Text key={index} className="font-nunito my-2 text-sm text-black">
              {index + 1}.{' '}
              <Link href={doc} className="text-brand underline">
                View Document
              </Link>
            </Text>
          ))
        ) : (
          <Text className="font-nunito my-2 text-sm text-gray-500">
            No documents submitted.
          </Text>
        )}
      </Section>

      <Hr className="my-5 border-[#e6ebf1]" />

      <Section className="my-6 text-center">
        <Button
          href={verificationUrl}
          className="bg-brand rounded-lg px-8 py-3 text-sm font-bold text-white"
        >
          Review and Verify User
        </Button>
      </Section>

      <Hr className="my-5 border-[#e6ebf1]" />

      <Text className="font-jetbrains mt-3 mb-6 text-xs leading-5 text-gray-500">
        This is an automated notification from your Ticketeur application.
      </Text>
    </Container>
  </EmailContainer>
)

OnboardingResponseEmail.PreviewProps = {
  userName: 'John Doe',
  userEmail: 'john@example.com',
  userId: '123e4567-e89b-12d3-a456-426614174000',
  documents: [
    'https://example.com/document1.pdf',
    'https://example.com/document2.pdf',
  ],
  verificationUrl: 'https://useticketeur.com/admin/verify/123',
} as OnboardingResponseEmailProps

export default OnboardingResponseEmail
