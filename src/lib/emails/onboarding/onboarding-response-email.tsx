import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Link,
  Button,
} from '@react-email/components'

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
}: OnboardingResponseEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New onboarding response from {userName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>New Onboarding Response</Heading>
            <Text style={text}>
              A new user has completed their onboarding process.
            </Text>

            <Hr style={hr} />

            <Section style={infoSection}>
              <Heading style={h2}>User Information</Heading>
              <Text style={infoText}>
                <strong>Name:</strong> {userName}
              </Text>
              <Text style={infoText}>
                <strong>Email:</strong> {userEmail}
              </Text>
              <Text style={infoText}>
                <strong>User ID:</strong> {userId}
              </Text>
            </Section>

            <Hr style={hr} />

            <Section style={documentsSection}>
              <Heading style={h2}>Submitted Documents</Heading>
              {documents.length > 0 ? (
                <Section>
                  {documents.map((doc, index) => (
                    <Section key={index} style={documentItem}>
                      <Text style={documentText}>
                        {index + 1}. <Link href={doc} style={link}>{doc}</Link>
                      </Text>
                    </Section>
                  ))}
                </Section>
              ) : (
                <Text style={text}>No documents submitted.</Text>
              )}
            </Section>

            <Hr style={hr} />

            <Section style={actionSection}>
              <Button href={verificationUrl} style={buttonStyle}>
                Review and Verify User
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              This is an automated notification from your Ticketuer application.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const box = {
  padding: '0 48px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
}

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '16px 0 12px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
}

const infoSection = {
  marginBottom: '16px',
}

const infoText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
}

const documentsSection = {
  marginTop: '16px',
}

const documentItem = {
  marginBottom: '8px',
}

const documentText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '4px 0',
}

const link = {
  color: '#007ee6',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const actionSection = {
  textAlign: 'center' as const,
  marginTop: '20px',
  marginBottom: '20px',
}

const buttonStyle = {
  backgroundColor: '#007ee6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '20px',
}
