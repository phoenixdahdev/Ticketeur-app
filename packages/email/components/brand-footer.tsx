import {
  Column,
  Container,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from 'react-email'
import {
  BRAND_EMAIL_ASSETS,
  BRAND_NAME_UPPER,
  LEGAL_LINKS,
  SOCIALS,
} from './brand'

export default function BrandFooter() {
  return (
    <Container className="mx-auto my-0 max-w-150 px-10 pt-4 pb-10">
      <Hr className="mb-6 border-gray-200" />

      <Section className="mb-4">
        <Row>
          <Column align="center">
            <table
              role="presentation"
              cellPadding={0}
              cellSpacing={0}
              border={0}
              style={{ margin: '0 auto' }}
            >
              <tbody>
                <tr>
                  {SOCIALS.map((s) => (
                    <td key={s.name} style={{ padding: '0 8px' }}>
                      <Link href={s.href}>
                        <Img
                          src={`${BRAND_EMAIL_ASSETS}/social/${s.icon}`}
                          width="24"
                          height="24"
                          alt={s.name}
                          className="block"
                        />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Column>
        </Row>
      </Section>

      <Text className="m-0 mb-3 text-center font-sans text-xs leading-5 text-gray-500">
        You are receiving this email because you registered to join the{' '}
        {BRAND_NAME_UPPER} platform as a user or a creator. This also confirms
        you agree to our Terms of use and Privacy Policy. If you no longer want
        to receive emails from us, click the unsubscribe link below.
      </Text>

      <Text className="m-0 text-center font-sans text-xs leading-5 text-gray-500">
        {LEGAL_LINKS.map((l, i) => (
          <span key={l.label}>
            {i > 0 ? <span className="px-2 text-gray-300">·</span> : null}
            <Link href={l.href} className="text-brand no-underline">
              {l.label}
            </Link>
          </span>
        ))}
      </Text>
    </Container>
  )
}

export { BrandFooter }
