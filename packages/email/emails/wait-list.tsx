import {
  Container,
  Heading,
  Preview,
  Text,
  Link,
} from '@react-email/components'
import EmailContainer from '../components/container'

interface WaitlistWelcomeEmailProps {
  name: string
}

export const WaitlistWelcomeEmail = ({ name }: WaitlistWelcomeEmailProps) => (
  <EmailContainer
    preview={<Preview>Welcome to the Ticketeur Waitlist!</Preview>}
  >
    <Container className="mx-auto px-3">
      <Heading className="font-montserrat my-10 p-0 text-2xl font-bold text-black">
        Welcome to Ticketeur, {name}!
      </Heading>

      <Text className="font-nunito my-6 text-sm text-black">
        Thank you for joining our waitlist. We're thrilled to have you on board
        and can't wait to share our platform with you.
      </Text>

      <Text className="font-nunito my-6 text-sm text-black">
        We are working hard to get everything ready. You'll be among the first
        to know when we launch.
      </Text>

      <Text className="font-nunito my-6 text-sm text-black">
        In the meantime, you can follow our progress on our website.
      </Text>

      <Link
        href="https://useticketeur.com"
        target="_blank"
        className="text-brand font-jetbrains mb-4 block text-sm underline"
      >
        Visit our website
      </Link>

      <Text className="font-nunito my-4 text-sm text-gray-400">
        If you did not sign up for this waitlist, you can safely ignore this
        email.
      </Text>

      <Text className="font-jetbrains mt-3 mb-6 text-xs leading-5 text-gray-500">
        Ticketeur - The future of event ticketing.
      </Text>
    </Container>
  </EmailContainer>
)

WaitlistWelcomeEmail.PreviewProps = {
  name: 'Alan Turing',
} as WaitlistWelcomeEmailProps

export default WaitlistWelcomeEmail
