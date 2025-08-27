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

interface VerificationEmailProps {
  firstName?: string
  otp: string
}

export const VerificationEmail = ({
  firstName,
  otp,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your verification code is {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>Verify your email address</Heading>
            <Text style={text}>Hi {firstName || 'there'},</Text>
            <Text style={text}>
              Thank you for signing up! Please use the following verification
              code to verify your email address:
            </Text>
            <Section style={otpContainer}>
              <Text style={otpText}>{otp}</Text>
            </Section>
            <Text style={text}>
              This code will expire in 10 minutes. If you didn't create an
              account, you can safely ignore this email.
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              For security reasons, never share this code with anyone.
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

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
}

const otpContainer = {
  backgroundColor: '#f8f9fa',
  border: '2px dashed #007ee6',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
  margin: '20px 0',
}

const otpText = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#007ee6',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: 'Courier, monospace',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
}
