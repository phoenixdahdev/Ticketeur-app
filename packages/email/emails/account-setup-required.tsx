import { Button, Container, Heading, Preview, Section, Text } from 'react-email'
import { BRAND_NAME, BRAND_NAME_UPPER, BRAND_URL } from '../components/brand'
import EmailContainer from '../components/container'

interface AccountSetupRequiredEmailProps {
  name: string
  setPasswordUrl: string
}

export default function AccountSetupRequiredEmail({
  name = 'Alex Johnson',
  setPasswordUrl = `${BRAND_URL}/forgot-password`,
}: Partial<AccountSetupRequiredEmailProps>) {
  return (
    <EmailContainer
      preview={<Preview>Finish setting up your {BRAND_NAME} account</Preview>}
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="text-brand-dark m-0 mb-4 text-2xl font-bold">
          Let&apos;s finish setting up your account
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {name},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          We found and fixed a technical problem on our side that affected a
          small number of {BRAND_NAME} sign-ups, including yours. Your account
          was created, but its password was never saved &mdash; which is why
          signing in wouldn&apos;t have worked.
        </Text>

        <Text className="m-0 mb-6 text-base leading-6 text-gray-700">
          Everything else is intact: your business details and your vendor
          profile are exactly as you left them. You just need to set a password.
        </Text>

        <Section className="bg-brand-light border-brand-light mb-6 rounded-lg border border-solid p-6 text-center">
          <Text className="text-brand-dark m-0 mb-4 text-sm leading-5">
            Use the button below and enter the email address this message was
            sent to. We&apos;ll email you a link to choose a new password.
          </Text>
          <Button
            className="bg-brand inline-block rounded-md px-6 py-3 text-center text-base font-semibold text-white no-underline"
            href={setPasswordUrl}
          >
            Set your password
          </Button>
        </Section>

        <Text className="m-0 mb-2 text-sm leading-5 text-gray-500">
          If the button above doesn&apos;t work, copy and paste this link into
          your browser:
        </Text>
        <Text className="text-brand m-0 mb-6 text-xs leading-5 break-all">
          {setPasswordUrl}
        </Text>

        <Text className="m-0 mb-6 text-base leading-6 text-gray-700">
          We&apos;re sorry for the trouble &mdash; this was our mistake, not
          anything you did. If you have any problems getting back in, just reply
          to this email and we&apos;ll sort it out with you.
        </Text>

        <Text className="m-0 text-sm leading-5 text-gray-500">
          &mdash; The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

AccountSetupRequiredEmail.PreviewProps = {
  name: 'Alex Johnson',
  setPasswordUrl: `${BRAND_URL}/forgot-password`,
} satisfies AccountSetupRequiredEmailProps

export { AccountSetupRequiredEmail }
