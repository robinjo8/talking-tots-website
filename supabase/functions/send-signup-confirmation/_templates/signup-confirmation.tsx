import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Img,
  Section,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface SignupConfirmationEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const SignupConfirmationEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
}: SignupConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Potrdi svoj račun pri TomiTalk</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo */}
        <Section style={header}>
          <div style={logoContainer}>
            <span style={logoTextGreen}>Tomi</span>
            <span style={logoTextOrange}>Talk</span>
          </div>
        </Section>

        {/* Welcome Content */}
        <Section style={content}>
          <Heading style={h1}>Dobrodošli pri TomiTalk! 🐉</Heading>
          
          <Text style={text}>
            Pozdravljeni!
          </Text>
          
          <Text style={text}>
            Hvala, ker se pridružujete naši skupnosti staršev, ki pomagajo svojim otrokom pri odpravljanju govornih težav.
          </Text>

          <Text style={text}>
            Za dokončanje registracije kliknite spodnjo povezavo:
          </Text>

          {/* Main CTA Button */}
          <Section style={buttonContainer}>
            <Button
              href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
              style={button}
            >
              Potrdi račun
            </Button>
          </Section>

          <Text style={smallText}>
            Ali pa kopirajte in prilepite to kodo za potrditev:
          </Text>
          <code style={code}>{token}</code>

          <Text style={text}>
            Ko boste potrdili svoj račun, boste lahko:
          </Text>
          
          <Text style={featureText}>
            ✅ Dodali profile svojih otrok<br/>
            ✅ Dostopali do personaliziranih vaj<br/>
            ✅ Spremljali napredek pri govornih vajah<br/>
            ✅ Uporabljali AI pomočnika za govorne težave
          </Text>

          <Text style={text}>
            Vaje so zasnovane na logopedskih smernicah in prilagojene starosti ter specifičnim potrebam vašega otroka.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Če niste ustvarili računa pri TomiTalk, lahko to sporočilo varno prezrete.
          </Text>
          <Text style={footerText}>
            S spoštovanjem,<br/>
            <span style={logoTextGreen}>Tomi</span><span style={logoTextOrange}>Talk</span> ekipa
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default SignupConfirmationEmail

// Styles based on TomiTalk brand colors
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
  backgroundColor: 'hsl(122, 39%, 95%)', // light-cloud
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
  color: 'hsl(122, 39%, 49%)', // dragon-green
  marginRight: '0',
}

const logoTextOrange = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: 'hsl(36, 100%, 50%)', // app-orange
}

const content = {
  backgroundColor: '#ffffff',
  padding: '30px',
  border: '1px solid #f0f0f0',
}

const h1 = {
  color: 'hsl(122, 39%, 49%)', // dragon-green
  fontSize: '28px',
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

const featureText = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '16px 0',
  backgroundColor: 'hsl(122, 39%, 98%)',
  padding: '16px',
  borderRadius: '8px',
  borderLeft: '4px solid hsl(122, 39%, 49%)',
}

const smallText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '16px 0 8px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: 'hsl(122, 39%, 49%)', // dragon-green
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '14px 28px',
  borderRadius: '25px',
  display: 'inline-block',
  border: 'none',
  cursor: 'pointer',
}

const code = {
  display: 'inline-block',
  padding: '12px 16px',
  width: 'auto',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  border: '1px solid #e9ecef',
  color: '#333333',
  fontSize: '16px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  textAlign: 'center' as const,
  margin: '10px 0 20px 0',
}

const footer = {
  backgroundColor: 'hsl(122, 39%, 95%)', // light-cloud
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