import {
  Container,
  Heading,
  Preview,
  Section,
  Text,
} from 'react-email'

import { BRAND_NAME, BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface VendorRejectedEmailProps {
  vendorName: string
  businessName: string
  reason: string
}

export default function VendorRejectedEmail({
  vendorName = 'Friend',
  businessName = 'Your business',
  reason = '',
}: Partial<VendorRejectedEmailProps>) {
  return (
    <EmailContainer
      preview={
        <Preview>
          {businessName}&apos;s {BRAND_NAME} application wasn&apos;t approved
        </Preview>
      }
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          Your vendor application wasn&apos;t approved
        </Heading>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {vendorName},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          After reviewing your vendor profile for{' '}
          <strong>{businessName}</strong>, our team wasn&apos;t able to
          approve your application at this time.
        </Text>

        {reason ? (
          <Section className="mb-6 rounded-lg bg-gray-50 px-5 py-4">
            <Text className="m-0 text-sm leading-5 text-gray-700">
              <strong>Reason:</strong> {reason}
            </Text>
          </Section>
        ) : null}

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          You can update your business details, showcase, and links and reply
          to this email to ask the team to take another look.
        </Text>

        <Text className="m-0 mt-6 text-base font-semibold leading-6 text-gray-800">
          The {BRAND_NAME_UPPER} Trust &amp; Safety Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

VendorRejectedEmail.PreviewProps = {
  vendorName: 'Alex',
  businessName: 'Neon Bites',
  reason: 'Showcase images do not meet our content guidelines.',
} satisfies VendorRejectedEmailProps

export { VendorRejectedEmail }
