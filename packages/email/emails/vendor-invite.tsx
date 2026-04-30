import {
  Button,
  Container,
  Heading,
  Preview,
  Section,
  Text,
} from 'react-email'

import { BRAND_NAME, BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface VendorInviteEmailProps {
  businessName: string
  contactName: string
  organizerName: string
  eventTitle: string
  signupUrl: string
}

export default function VendorInviteEmail({
  businessName = 'Your Business',
  contactName = 'Friend',
  organizerName = 'an organizer',
  eventTitle = 'an upcoming event',
  signupUrl = '#',
}: Partial<VendorInviteEmailProps>) {
  return (
    <EmailContainer
      preview={<Preview>{`You've been invited to ${eventTitle}`}</Preview>}
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          You&apos;re invited to {eventTitle}
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {contactName},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          {organizerName} has invited <strong>{businessName}</strong> to be a
          vendor at <strong>{eventTitle}</strong> on {BRAND_NAME}.
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          To accept the invitation, finish setting up your vendor account.
          You&apos;ll be able to manage your participation, set up your stall
          and connect with attendees once the {BRAND_NAME} team approves your
          profile.
        </Text>

        <Section className="mb-8">
          <Button
            href={signupUrl}
            className="bg-brand inline-block rounded-md px-6 py-3 text-center text-base font-semibold text-white no-underline"
          >
            Accept Invitation
          </Button>
        </Section>

        <Text className="m-0 mb-2 text-sm leading-5 text-gray-500">
          If you didn&apos;t expect this invitation, you can safely ignore this
          email.
        </Text>

        <Text className="m-0 mt-6 text-base font-semibold leading-6 text-gray-800">
          Welcome to {BRAND_NAME_UPPER},
        </Text>
        <Text className="m-0 text-base font-semibold leading-6 text-gray-800">
          The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

VendorInviteEmail.PreviewProps = {
  businessName: 'Neon Bites',
  contactName: 'Alex',
  organizerName: 'Jordan',
  eventTitle: 'Lagos Tech Fest 2026',
  signupUrl: 'https://www.useticketeur.com/sign-up?invite=demo',
} satisfies VendorInviteEmailProps

export { VendorInviteEmail }
