import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'The terms that govern your access to and use of the Ticketeur platform.',
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
    title: '1. Acceptance of Terms',
    paragraph:
      'By creating an account or using the Service, you confirm that you are at least 18 years old and agree to be bound by these Terms. If you do not agree, you must not use the Service.',
  },
  {
    title: '2. Eligibility',
    intro: 'To use Ticketeur, you must:',
    items: [
      'Be of legal age to form a binding contract in your jurisdiction',
      'Provide accurate and complete information during signup',
      'Maintain the security of your account credentials',
    ],
  },
  {
    title: '3. Accounts and Roles',
    intro:
      'Ticketeur supports multiple account roles, each with its own responsibilities:',
    items: [
      {
        label: 'Attendees',
        value:
          'May discover, purchase, and manage tickets for available events',
      },
      {
        label: 'Organizers',
        value:
          'May create and manage events, list tickets, and coordinate vendors',
      },
      {
        label: 'Vendors',
        value:
          'May apply to participate in moderated events and operate booths',
      },
    ],
  },
  {
    title: '4. Tickets and Payments',
    intro: 'When you purchase a ticket through the Service:',
    items: [
      'All sales are final unless otherwise stated by the organizer',
      'Prices are displayed in your local currency where supported',
      'Payment processing is handled by trusted third-party providers',
    ],
  },
  {
    title: '5. Prohibited Conduct',
    intro: 'You agree not to:',
    items: [
      'Resell tickets outside the platform in violation of organizer policies',
      'Misrepresent your identity, credentials, or affiliation',
      'Interfere with the Service or attempt to bypass security measures',
      'Upload content that is unlawful, infringing, or harmful',
    ],
  },
  {
    title: '6. Content and Intellectual Property',
    paragraph:
      'All content you submit remains yours, but you grant Ticketeur a worldwide, non-exclusive license to display and distribute it as needed to operate the Service. The Ticketeur name, logo, and platform are protected by intellectual property laws.',
  },
  {
    title: '7. Refunds and Cancellations',
    paragraph:
      'Refund eligibility is determined by the organizer of each event. Where a refund is granted, it will be processed back to the original payment method within a reasonable timeframe.',
  },
  {
    title: '8. Disclaimers',
    paragraph:
      'The Service is provided “as is” without warranties of any kind. Ticketeur does not guarantee that events will take place as advertised or that the Service will be uninterrupted or error-free.',
  },
  {
    title: '9. Limitation of Liability',
    paragraph:
      'To the maximum extent permitted by law, Ticketeur is not liable for indirect, incidental, or consequential damages arising from your use of the Service.',
  },
  {
    title: '10. Termination',
    paragraph:
      'We may suspend or terminate your access at any time if you breach these Terms or engage in conduct that harms other users, organizers, or the platform.',
  },
  {
    title: '11. Changes to These Terms',
    paragraph:
      'We may update these Terms from time to time. Material changes will be communicated via the platform, and continued use after the effective date constitutes acceptance of the updated Terms.',
  },
]

export default function TermsPage() {
  return (
    <>
      <section
        aria-label="Terms and conditions header"
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
        <div aria-hidden className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto flex w-full max-w-360 flex-col items-center gap-3 px-6 py-20 text-center md:py-24">
          <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl md:text-[56px] md:leading-[1.2]">
            Terms and Conditions
          </h1>
          <p className="font-heading text-base font-semibold text-white/90 md:text-xl">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <article className="mx-auto w-full max-w-[823px] px-6 py-16 md:py-20">
        <p className="font-heading text-foreground/90 text-lg leading-7 md:text-xl md:leading-8">
          These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access
          to and use of the Ticketeur platform (the &ldquo;Service&rdquo;).
          Please read them carefully — by using the Service you agree to be
          bound by these Terms.
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
              12. Contact Us
            </h2>
            <p className="font-heading text-foreground/90 text-base leading-7 md:text-lg md:leading-8">
              For questions about these Terms, contact us at:{' '}
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
