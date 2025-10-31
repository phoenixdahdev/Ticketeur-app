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
} from '@react-email/components'

interface OnboardingDeclinedEmailProps {
  firstName: string
  reason?: string
}

export const OnboardingDeclinedEmail = ({
  firstName,
  reason,
}: OnboardingDeclinedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Update on your Ticketuer account verification</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>Account Verification Update</Heading>
            <Text style={text}>Hi {firstName},</Text>
            <Text style={text}>
              Thank you for your interest in Ticketuer. After reviewing your
              onboarding submission, we regret to inform you that we are unable
              to approve your account at this time.
            </Text>

            {reason && (
              <Section style={reasonSection}>
                <Heading style={h2}>Reason</Heading>
                <Text style={reasonText}>{reason}</Text>
              </Section>
            )}

            <Text style={text}>
              If you believe this was a mistake or would like to resubmit your
              documents, please contact our support team for assistance.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Thank you for your understanding.
              <br />
              The Ticketuer Team
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
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '16px 0 8px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '16px',
}

const reasonSection = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffc107',
  borderRadius: '8px',
  padding: '16px',
  margin: '20px 0',
}

const reasonText = {
  color: '#856404',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '20px',
  marginTop: '20px',
}
