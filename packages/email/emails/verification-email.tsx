import {
  Container,
  Heading,
  Preview,
  Text,
  Section,
  Hr,
} from '@react-email/components'
import EmailContainer from '../components/container'

interface VerificationEmailProps {
  firstName?: string
  otp: string
}

export const VerificationEmail = ({
  firstName,
  otp,
}: VerificationEmailProps) => (
  <EmailContainer
    preview={<Preview>Your verification code is {otp}</Preview>}
  >
    <Container className="mx-auto px-3">
      <Heading className="font-montserrat my-10 p-0 text-2xl font-bold text-black">
        Verify your email address
      </Heading>
      <Text className="font-nunito my-6 text-sm text-black">
        Hi {firstName || 'there'},
      </Text>
      <Text className="font-nunito my-6 text-sm text-black">
        Thank you for signing up! Please use the following verification code to
        verify your email address:
      </Text>
      <Section className="my-5 rounded-lg border-2 border-dashed border-[#007ee6] bg-[#f8f9fa] p-5 text-center">
        <Text className="font-jetbrains m-0 text-3xl font-bold tracking-[8px] text-[#007ee6]">
          {otp}
        </Text>
      </Section>
      <Text className="font-nunito my-6 text-sm text-black">
        This code will expire in 10 minutes. If you didn&apos;t create an
        account, you can safely ignore this email.
      </Text>
      <Hr className="my-5 border-[#e6ebf1]" />
      <Text className="text-xs leading-4 text-gray-500">
        For security reasons, never share this code with anyone.
      </Text>
    </Container>
  </EmailContainer>
)

VerificationEmail.PreviewProps = {
  otp: '123456',
} as VerificationEmailProps

export default VerificationEmail
