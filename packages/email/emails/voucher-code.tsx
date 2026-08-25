import { Button, Container, Heading, Preview, Section, Text } from 'react-email'
import { BRAND_NAME, BRAND_NAME_UPPER, BRAND_URL } from '../components/brand'
import EmailContainer from '../components/container'

interface VoucherCodeEmailProps {
  code: string
  /** Rendered discount, e.g. "20% off" or "₦1,500 off". */
  discountLabel: string
  /** Event title when the code is scoped to one event, else null. */
  eventTitle: string | null
  /** Human date, e.g. "12 September 2026". Null when the code has no expiry. */
  expiresOn: string | null
  /** Where the "Book now" button goes — the event, or the events index. */
  ctaUrl: string
  /** Optional note from the sender, shown above the code. */
  note: string | null
}

export default function VoucherCodeEmail({
  code = 'EARLY20',
  discountLabel = '20% off',
  eventTitle = null,
  expiresOn = null,
  ctaUrl = `${BRAND_URL}/events`,
  note = null,
}: Partial<VoucherCodeEmailProps>) {
  const scope = eventTitle ?? 'any event on Ticketeur'
  return (
    <EmailContainer
      preview={
        <Preview>
          {discountLabel} with code {code}
        </Preview>
      }
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="text-brand-dark m-0 mb-4 text-2xl font-bold">
          Here&apos;s {discountLabel} your next ticket
        </Heading>

        {note ? (
          <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
            {note}
          </Text>
        ) : null}

        <Text className="m-0 mb-6 text-base leading-6 text-gray-700">
          Use the code below at checkout to get <strong>{discountLabel}</strong>{' '}
          on {scope}.
        </Text>

        <Section className="bg-brand-light border-brand-light mb-6 rounded-lg border border-solid p-6 text-center">
          <Text className="text-brand-dark m-0 mb-1 text-xs font-bold tracking-widest uppercase">
            Your code
          </Text>
          <Text className="text-brand-dark m-0 mb-4 font-sans text-3xl font-extrabold tracking-[0.2em]">
            {code}
          </Text>
          {expiresOn ? (
            <Text className="text-brand-dark m-0 mb-4 text-sm leading-5">
              Valid until <strong>{expiresOn}</strong>.
            </Text>
          ) : null}
          <Button
            className="bg-brand inline-block rounded-md px-6 py-3 text-center text-base font-semibold text-white no-underline"
            href={ctaUrl}
          >
            Book now
          </Button>
        </Section>

        <Text className="m-0 mb-6 text-sm leading-5 text-gray-500">
          Enter the code in the <strong>Voucher</strong> field on the checkout
          screen and the discount is applied before you pay. Codes can run out
          or expire, so it&apos;s worth using it sooner rather than later.
        </Text>

        <Text className="m-0 text-sm leading-5 text-gray-500">
          &mdash; The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

VoucherCodeEmail.PreviewProps = {
  code: 'EARLY20',
  discountLabel: '20% off',
  eventTitle: 'The Crowd Concert',
  expiresOn: '12 September 2026',
  ctaUrl: `${BRAND_URL}/events/the-crowd-concert`,
  note: 'Thanks for coming to our last show — here is something for the next one.',
} satisfies VoucherCodeEmailProps

export { VoucherCodeEmail }
