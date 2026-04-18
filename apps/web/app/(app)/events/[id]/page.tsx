import type { Metadata } from 'next'
import {
  DrinkIcon,
  EyeIcon,
  GameController01Icon,
  MusicNote03Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'

import { EventHero } from '@/components/sections/event-detail/event-hero'
import { EventTabs } from '@/components/sections/event-detail/event-tabs'
import { SimilarEvents } from '@/components/sections/event-detail/similar-events'
import type { EventDetailData } from '@/components/sections/event-detail/types'

const DEMO_EVENT: EventDetailData = {
  id: 'lagos-fest-2026',
  title: 'Lagos Fest 2026',
  status: 'Upcoming Event',
  date: 'July 15, 2026',
  time: '08:00 PM',
  location: 'Victoria Island, Lagos',
  price: '₦10,000',
  imageUrl:
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80',
  description: [
    "Experience the ultimate fusion of light and sound at Lagos Fest 2026. This one-night music festival brings together the world's most innovative electronic artists for an immersive journey at the iconic Brooklyn Mirage.",
    "Featuring a massive 200ft LED wall, state-of-the-art spatial audio, and curated light installations that respond to the music, this isn't just a concert—it's a multi-sensory environment. Expect headline sets, exclusive collaborations, and a vibe that lasts until the break of dawn.",
  ],
  features: [
    { icon: MusicNote03Icon, label: 'Live DJ Sets' },
    { icon: EyeIcon, label: 'Laser Show' },
    { icon: DrinkIcon, label: 'Open VIP Bar' },
    { icon: UserGroupIcon, label: 'Mascots' },
    { icon: GameController01Icon, label: 'Games' },
  ],
  buyHref: '#',
}

export async function generateMetadata({
  params,
}: PageProps<'/events/[id]'>): Promise<Metadata> {
  void (await params)
  return {
    title: DEMO_EVENT.title,
    description: DEMO_EVENT.description[0],
  }
}

export default async function EventDetailPage({
  params,
}: PageProps<'/events/[id]'>) {
  void (await params)
  const event = DEMO_EVENT

  return (
    <>
      <EventHero event={event} />
      <EventTabs event={event} />
      <SimilarEvents />
    </>
  )
}
