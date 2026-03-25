import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface TestReminderEmailProps {
  childName: string
  title: string
  message: string
  milestoneType: string
}

export const TestReminderEmail = ({
  childName,
  title,
  message,
  milestoneType,
}: TestReminderEmailProps) => {
  const isUrgent = milestoneType === 'test_reminder_7d_after'
  const isAvailable = milestoneType === 'test_available'

  return (
    <Html>
      <Head />
      <Preview>{title} – {childName}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <div style={logoContainer}>
              <span style={logoTextGreen}>Tomi</span>
              <span style={logoTextOrange}>Talk</span>
            </div>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>{title}</Heading>

            <Text style={text}>
              Pozdravljeni!
            </Text>

            <Text style={text}>
              Za otroka <strong>{childName}</strong> vas obveščamo:
            </Text>

            <Text style={isUrgent ? urgentText : highlightText}>
              {message}
            </Text>

            {(isAvailable || isUrgent || milestoneType === 'test_reminder_3d_after') && (
              <Section style={buttonContainer}>
                <Button
                  href="https://tomitalk.com/artikulacijski-test"
                  style={button}
                >
                  Opravi preverjanje
                </Button>
              </Section>
            )}

            <Text style={text}>
              Redno preverjanje izgovorjave pomaga spremljati napredek vašega otroka in prilagajati vaje za čim boljše rezultate.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              S spoštovanjem,<br />
              <span style={logoTextGreen}>Tomi</span><span style={logoTextOrange}>Talk</span>
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              To sporočilo ste prejeli, ker imate račun pri TomiTalk.<br />
              Če teh e-poštnih sporočil ne želite več prejemati, se lahko odjavite.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default TestReminderEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
}

const header = {
  backgroundColor: 'hsl(122, 39%, 95%)',
  padding: '20px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
}

const logoContainer = {
  display: 'inline-block',
}

const logoTextGreen = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: 'hsl(122, 39%, 49%)',
}

const logoTextOrange = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: 'hsl(36, 100%, 50%)',
}

const content = {
  backgroundColor: '#ffffff',
  padding: '30px',
  border: '1px solid #f0f0f0',
}

const h1 = {
  color: 'hsl(122, 39%, 49%)',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
}

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const highlightText = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '16px 0',
  backgroundColor: 'hsl(122, 39%, 98%)',
  padding: '16px',
  borderRadius: '8px',
  borderLeft: '4px solid hsl(122, 39%, 49%)',
}

const urgentText = {
  color: '#92400e',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '16px 0',
  backgroundColor: '#fffbeb',
  padding: '16px',
  borderRadius: '8px',
  borderLeft: '4px solid hsl(36, 100%, 50%)',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: 'hsl(122, 39%, 49%)',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '14px 28px',
  borderRadius: '25px',
  display: 'inline-block',
  border: 'none',
}

const footer = {
  backgroundColor: 'hsl(122, 39%, 95%)',
  padding: '20px',
  textAlign: 'center' as const,
  borderRadius: '0 0 12px 12px',
}

const footerText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '8px 0',
}
