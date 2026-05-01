import {
  Button,
  Container,
  Heading,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email'

import {
  BRAND_NAME,
  BRAND_NAME_UPPER,
  BRAND_URL,
} from '../components/brand'
import EmailContainer from '../components/container'

interface VendorApprovedEmailProps {
  vendorName: string
  businessName: string
  profileUrl: string
}

export default function VendorApprovedEmail({
  vendorName = 'Friend',
  businessName = 'Your business',
  profileUrl = `${BRAND_URL}/vendor/profile`,
}: Partial<VendorApprovedEmailProps>) {
  return (
    <EmailContainer
      preview={
        <Preview>{businessName} is now approved on {BRAND_NAME}</Preview>
      }
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          You&apos;re approved
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {vendorName},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Good news — your vendor profile for <strong>{businessName}</strong>{' '}
          has been approved by our team. Organizers can now invite you to
          their events and you&apos;ll appear on the {BRAND_NAME} public
          vendor directory.
        </Text>

        <Section className="mb-8">
          <Row>
            <Button
              href={profileUrl}
              className="bg-brand inline-block rounded-md px-6 py-3 text-center text-base font-semibold text-white no-underline"
            >
              View your profile
            </Button>
          </Row>
        </Section>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Make sure your showcase, social links, and description are
          up-to-date to put your best foot forward.
        </Text>

        <Text className="m-0 mt-6 text-base font-semibold leading-6 text-gray-800">
          The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

VendorApprovedEmail.PreviewProps = {
  vendorName: 'Alex',
  businessName: 'Neon Bites',
  profileUrl: 'https://www.useticketeur.com/vendor/profile',
} satisfies VendorApprovedEmailProps

export { VendorApprovedEmail }
