import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Ticketeur collects, uses, and protects your information when you use our platform.',
}

const LAST_UPDATED = 'May 1, 2026'
const CONTACT_EMAIL = 'Ticketeurmgt@gmail.com'

type Section = {
  title: string
  intro?: string
  paragraph?: string
  items?: Array<string | { label: string; value: string }>
}

const SECTIONS: Section[] = [
  {
    title: '1. Information We Collect',
    intro: 'We may collect the following types of information:',
    items: [
      {
        label: 'Personal Information',
        value: 'Name, email address, phone number, and payment details',
      },
      {
        label: 'Account Information',
        value: 'Login credentials and user preferences',
      },
      {
        label: 'Usage Data',
        value:
          'Interactions with the platform, device information, IP address, and browser type',
      },
    ],
  },
  {
    title: '2. How We Use Your Information',
    intro: 'We use your information to:',
    items: [
      'Provide and maintain the Service',
      'Process transactions and send confirmations',
      'Improve user experience and platform functionality',
      'Communicate updates, promotions, and support messages',
      'Ensure security and prevent fraud',
    ],
  },
  {
    title: '3. Sharing of Information',
    intro:
      'We do not sell your personal data. However, we may share information with:',
    items: [
      'Service providers (payment processors, hosting providers)',
      'Legal authorities when required by law',
      'Business partners where necessary for service delivery',
    ],
  },
  {
    title: '4. Data Retention',
    paragraph:
      'We retain your data only for as long as necessary to fulfill the purposes outlined in this policy or comply with legal obligations.',
  },
  {
    title: '5. Data Security',
    paragraph:
      'We implement appropriate technical and organizational measures to protect your information. However, no system is completely secure.',
  },
  {
    title: '6. Your Rights',
    intro: 'You may:',
    items: [
      'Access or request a copy of your data',
      'Request correction or deletion',
      'Opt out of marketing communications',
    ],
  },
  {
    title: '7. Cookies and Tracking',
    paragraph:
      'We use cookies to improve your experience, analyze usage, and personalize content.',
  },
  {
    title: '8. Changes to This Policy',
    paragraph:
      'We may update this policy from time to time. Changes will be communicated via the platform.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <section
        aria-label="Privacy policy header"
        className="relative isolate flex min-h-[360px] w-full items-center justify-center overflow-hidden md:min-h-[546px]"
      >
        <Image
          src="/legal.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-black/50"
        />
        <div className="relative z-10 mx-auto flex w-full max-w-360 flex-col items-center gap-3 px-6 py-20 text-center md:py-24">
          <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl md:text-[56px] md:leading-[1.2]">
            Privacy Policy
          </h1>
          <p className="font-heading text-base font-semibold text-white/90 md:text-xl">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <article className="mx-auto w-full max-w-[823px] px-6 py-16 md:py-20">
        <p className="font-heading text-foreground/90 text-lg leading-7 md:text-xl md:leading-8">
          This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you use our platform (&ldquo;Service&rdquo;).
          By accessing or using the Service, you agree to the terms outlined in
          this policy.
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {SECTIONS.map((section) => (
            <section key={section.title} className="flex flex-col gap-3">
              <h2 className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
                {section.title}
              </h2>

              {section.paragraph ? (
                <p className="font-heading text-foreground/90 text-base leading-7 md:text-lg md:leading-8">
                  {section.paragraph}
                </p>
              ) : null}

              {section.intro ? (
                <p className="font-heading text-foreground/90 text-base leading-7 md:text-lg md:leading-8">
                  {section.intro}
                </p>
              ) : null}

              {section.items ? (
                <ul className="font-heading text-foreground/90 ml-5 flex list-disc flex-col gap-1 text-base leading-7 md:text-lg md:leading-8">
                  {section.items.map((item) => {
                    if (typeof item === 'string') {
                      return <li key={item}>{item}</li>
                    }
                    return (
                      <li key={item.label}>
                        <span className="font-bold">{item.label}:</span>{' '}
                        {item.value}
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="flex flex-col gap-3">
            <h2 className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
              9. Contact Us
            </h2>
            <p className="font-heading text-foreground/90 text-base leading-7 md:text-lg md:leading-8">
              For questions or concerns, contact us at:{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary font-bold hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </article>
    </>
  )
}
