'use client'

import { notFound } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import type { IconSvgElement } from '@hugeicons/react'
import {
  MusicNote03Icon,
  Idea01Icon,
  DrinkIcon,
  UserGroupIcon,
  GameController01Icon,
  CameraVideoIcon,
  Briefcase01Icon,
  PaintBoardIcon,
  StarIcon,
} from '@hugeicons/core-free-icons'

import { useTRPC } from '@/lib/trpc'
import { formatNaira, formatEventDate } from '@/lib/event-display'

import { EventHero } from '@/components/sections/event-detail/event-hero'
import { EventTabs } from '@/components/sections/event-detail/event-tabs'
import { SimilarEvents } from '@/components/sections/event-detail/similar-events'
import type { EventDetailData } from '@/components/sections/event-detail/types'

const FEATURE_ICONS: Record<string, IconSvgElement> = {
  'Live DJ Sets': MusicNote03Icon,
  'Laser Show': Idea01Icon,
  'Open VIP Bar': DrinkIcon,
  Mascots: UserGroupIcon,
  Games: GameController01Icon,
  'Food & Drink': DrinkIcon,
  Workshops: Briefcase01Icon,
  Networking: UserGroupIcon,
  'Live Music': MusicNote03Icon,
  'Photo Booth': CameraVideoIcon,
  'Art Showcase': PaintBoardIcon,
}

function iconForFeature(label: string): IconSvgElement {
  return FEATURE_ICONS[label] ?? StarIcon
}

const EVENT_PLACEHOLDER = '/hero-bg.png'

export function EventDetailContent({ id }: { id: string }) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.public.events.byId.queryOptions({ id })
  )

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[1440px] items-center justify-center px-5 py-20 md:px-10 md:py-28">
        <p className="text-muted-foreground text-sm">Loading event…</p>
      </div>
    )
  }
  if (!data) {
    notFound()
  }

  const { event, minPriceMinor } = data

  const detail: EventDetailData = {
    id: event.id,
    title: event.title,
    status: 'Upcoming Event',
    date: formatEventDate(event.eventDate),
    time: event.eventTime,
    location: event.location,
    imageUrl: event.bannerUrl ?? EVENT_PLACEHOLDER,
    description: event.description ? [event.description] : [],
    features: event.features.map((label) => ({
      icon: iconForFeature(label),
      label,
    })),
    price: minPriceMinor > 0 ? formatNaira(minPriceMinor) : 'Free',
    buyHref: `/events/${event.id}?tab=tickets`,
  }

  return (
    <>
      <EventHero event={detail} />
      <EventTabs event={detail} />
      <SimilarEvents />
    </>
  )
}
