import {
  Button,
  Column,
  Container,
  Heading,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email'

import { BRAND_NAME, BRAND_NAME_UPPER } from '../components/brand'
import EmailContainer from '../components/container'

interface TicketConfirmationEmailProps {
  firstName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  ticketTier: string
  quantity: number
  ticketsUrl: string
  heroImageUrl: string
}

export default function TicketConfirmationEmail({
  firstName = 'Friend',
  eventTitle = 'Your event',
  eventDate = '',
  eventTime = '',
  eventLocation = '',
  ticketTier = '',
  quantity = 1,
  ticketsUrl = '#',
  heroImageUrl = 'https://www.useticketeur.com/email/ticket-hero.png',
}: Partial<TicketConfirmationEmailProps>) {
  return (
    <EmailContainer
      preview={<Preview>{`Your ${eventTitle} ticket is ready 🎉`}</Preview>}
    >
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Section className="mb-6">
          <Img
            src={heroImageUrl}
            width="520"
            height="240"
            alt="Tickets"
            className="block w-full rounded-lg"
          />
        </Section>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Hi {firstName},
        </Text>

        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          Your ticket purchase was successful! 🎉
        </Text>

        <Text className="m-0 mb-2 text-base leading-6 text-gray-700">
          Here are your event details:
        </Text>

        <Section className="mb-6 rounded-lg border border-gray-200 px-5 py-4">
          <DetailRow label="Event:" value={eventTitle} />
          <DetailRow label="Date:" value={eventDate} />
          <DetailRow label="Time:" value={eventTime} />
          <DetailRow label="Location:" value={eventLocation} />
          <DetailRow label="Ticket Type:" value={ticketTier} />
          <DetailRow label="Quantity:" value={String(quantity)} last />
        </Section>

        <Text className="m-0 mb-2 text-base leading-6 text-gray-700">
          Your ticket(s) are attached to this email.
        </Text>
        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
          🎟 Each ticket includes a unique QR code. Please present it at the
          event for entry.
        </Text>

        <Section className="mb-6">
          <Button
            href={ticketsUrl}
            className="bg-brand inline-block rounded-md px-6 py-3 text-center text-base font-semibold text-white no-underline"
          >
            Download ticket(s)
          </Button>
        </Section>

        <Text className="m-0 mb-2 text-sm leading-5 text-gray-600">
          If you have any issues accessing your ticket, contact us and
          we&apos;ll assist you right away.
        </Text>
        <Text className="m-0 mb-6 text-sm leading-5 text-gray-600">
          We look forward to seeing you there!
        </Text>

        <Heading
          as="h3"
          className="m-0 text-base font-semibold leading-6 text-gray-900"
        >
          Enjoy the experience,
        </Heading>
        <Text className="m-0 text-base font-semibold leading-6 text-gray-900">
          The {BRAND_NAME_UPPER} Team
        </Text>
      </Container>
    </EmailContainer>
  )
}

function DetailRow({
  label,
  value,
  last,
}: {
  label: string
  value: string
  last?: boolean
}) {
  return (
    <Row className={last ? '' : 'mb-2'}>
      <Column align="left" className="text-sm leading-5 text-gray-600">
        {label}
      </Column>
      <Column
        align="right"
        className="text-sm font-semibold leading-5 text-gray-900"
      >
        {value}
      </Column>
    </Row>
  )
}

TicketConfirmationEmail.PreviewProps = {
  firstName: 'Alex',
  eventTitle: 'Lagos Fest 2026',
  eventDate: 'Saturday, October 24, 2026',
  eventTime: '9:00 AM – 6:00 PM',
  eventLocation: 'Eko Convention Centre, Lagos',
  ticketTier: 'VIP Experience',
  quantity: 2,
  ticketsUrl: `https://www.useticketeur.com/tickets/demo`,
  heroImageUrl: `https://www.useticketeur.com/email/ticket-hero.png`,
} satisfies TicketConfirmationEmailProps

export { TicketConfirmationEmail }
