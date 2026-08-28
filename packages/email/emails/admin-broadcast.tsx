import { Container, Heading, Markdown, Preview } from 'react-email'

import EmailContainer from '../components/container'

interface AdminBroadcastEmailProps {
  subject: string
  // Markdown authored by an admin in the composer.
  body: string
}

export default function AdminBroadcastEmail({
  subject = 'A message from the team',
  body = '',
}: Partial<AdminBroadcastEmailProps>) {
  return (
    <EmailContainer preview={<Preview>{subject}</Preview>}>
      <Container className="mx-auto my-0 max-w-150 px-10">
        <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
          {subject}
        </Heading>

        <Markdown
          markdownContainerStyles={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151',
          }}
        >
          {body}
        </Markdown>
      </Container>
    </EmailContainer>
  )
}

AdminBroadcastEmail.PreviewProps = {
  subject: 'Weekend line-up just dropped 🎉',
  body: 'Hi there,\n\nWe just added **five new events** for this weekend.\n\n- Lagos Tech Fest\n- Afrobeats Live\n- Art Walk Victoria Island\n\nGrab your tickets before they sell out.\n\nSee you there,\nThe team',
} satisfies AdminBroadcastEmailProps

export { AdminBroadcastEmail }
