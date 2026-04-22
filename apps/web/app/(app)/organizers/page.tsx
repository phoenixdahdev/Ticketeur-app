import type { Metadata } from 'next'

import { OrganisersCta } from '@/components/sections/organisers/organisers-cta'
import { OrganisersFeatures } from '@/components/sections/organisers/organisers-features'
import { OrganisersHero } from '@/components/sections/organisers/organisers-hero'
import { OrganisersPath } from '@/components/sections/organisers/organisers-path'
import { OrganisersTrust } from '@/components/sections/organisers/organisers-trust'

export const metadata: Metadata = {
  title: 'For Organizers',
  description:
    'Empower your events with Ticketeur — a secure, moderated marketplace for professional organisers to manage ticketing and vendors flawlessly.',
}

export default function OrganisersPage() {
  return (
    <>
      <OrganisersHero />
      <OrganisersFeatures />
      <OrganisersPath />
      <OrganisersTrust />
      <OrganisersCta />
    </>
  )
}
