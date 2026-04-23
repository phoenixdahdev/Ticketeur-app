import { Container, Img, Section } from 'react-email'
import { BRAND_EMAIL_ASSETS, BRAND_NAME } from './brand'

export default function BrandHeader() {
  return (
    <Container className="mx-auto my-0 max-w-150 px-10 pt-8 pb-4">
      <Section>
        <Img
          src={`${BRAND_EMAIL_ASSETS}/logo.png`}
          width="164"
          height="50"
          alt={BRAND_NAME}
          className="block"
        />
      </Section>
    </Container>
  )
}

export { BrandHeader }
