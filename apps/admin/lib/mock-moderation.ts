// Mock moderation data — vendor applications, event approvals, flagged
// activities. UI-only; replace with tRPC once admin routers exist.

import type { IconSvgElement } from '@hugeicons/react'
import {
  MusicNote03Icon,
  Idea01Icon,
  DrinkIcon,
  UserGroupIcon,
  GameController01Icon,
} from '@hugeicons/core-free-icons'

export type PendingVendor = {
  id: string
  name: string
  category: string
  email: string
  registeredAt: string
  logoUrl: string | null
  instagramUrl: string | null
  websiteUrl: string | null
  description: string
  showcase: string[]
}

export type PendingEvent = {
  id: string
  title: string
  category: string
  registeredAt: string
  organizerName: string
  organizerEmail: string
  organizerAvatarUrl: string | null
  organizerJoined: string
  bannerUrl: string
  description: string
  eventDate: string
  eventTime: string
  location: string
  features: { label: string; icon: IconSvgElement }[]
  tiers: TicketTier[]
  vendors: AssignedVendor[]
  thumbnailUrl: string
}

export type TicketTier = {
  id: string
  name: string
  detail: string
  sold: number
  total: number
  price: number
  status: 'sold-out' | 'active' | 'early'
}

export type AssignedVendor = {
  id: string
  name: string
  category: string
  imageUrl: string
  description: string
}

export type FlaggedActivity = {
  id: string
  subjectType: 'vendor' | 'organizer' | 'attendee' | 'event'
  date: string
  reason: string
  detail: string
}

const SHOWCASE = Array.from(
  { length: 9 },
  () =>
    'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?w=400&h=400&fit=crop'
)

const PENDING_VENDORS: PendingVendor[] = [
  {
    id: 'v1',
    name: 'Tasty Bites',
    category: 'Snacks',
    email: 'tastybites@gmail.com',
    registeredAt: '2026-08-10',
    logoUrl: null,
    instagramUrl: 'instagram.com/neonbites',
    websiteUrl: null,
    description:
      'Serving award-winning wagyu sliders and truffle fries throughout the event.',
    showcase: SHOWCASE,
  },
  {
    id: 'v2',
    name: 'Sweetness',
    category: 'Drinks',
    email: 'sweetness@gmail.com',
    registeredAt: '2026-08-10',
    logoUrl:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
    instagramUrl: 'instagram.com/tastybites',
    websiteUrl: 'sweetness.com',
    description:
      'Hand-crafted artisanal lemonades and small-batch sodas for festival days.',
    showcase: SHOWCASE,
  },
]

const PENDING_EVENTS: PendingEvent[] = [
  {
    id: 'e1',
    title: 'Lagos Fest 2026',
    category: 'Music',
    registeredAt: '2026-08-10',
    organizerName: 'Chill Circle',
    organizerEmail: 'chillcircle@yahoo.com',
    organizerAvatarUrl: null,
    organizerJoined: '2024-08-05',
    bannerUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&h=560&fit=crop',
    description:
      'Join the brightest minds in tech for a day of innovation, networking, and expert-led sessions. This year\'s conference focuses on the integration of Artificial Intelligence and Sustainable Infrastructure. Keynote speakers include industry pioneers from leading global tech firms.',
    eventDate: '2026-11-12',
    eventTime: '09:00 AM – 06:00 PM',
    location: 'Main Ballroom, Convention Center',
    features: [
      { label: 'Live DJ Sets', icon: MusicNote03Icon },
      { label: 'Laser Show', icon: Idea01Icon },
      { label: 'Open VIP Bar', icon: DrinkIcon },
      { label: 'Mascots', icon: UserGroupIcon },
      { label: 'Games', icon: GameController01Icon },
    ],
    tiers: [
      {
        id: 't1',
        name: 'Early Bird Pass',
        detail: 'Tier 1 · Ended Oct 31',
        sold: 200,
        total: 200,
        price: 10_000,
        status: 'sold-out',
      },
      {
        id: 't2',
        name: 'General Admission',
        detail: 'Tier 2 · 2-5+ live',
        sold: 212,
        total: 600,
        price: 15_000,
        status: 'active',
      },
      {
        id: 't3',
        name: 'VIP Networking Pass',
        detail: 'Tier 3 · Limited',
        sold: 88,
        total: 150,
        price: 30_000,
        status: 'early',
      },
    ],
    vendors: [
      {
        id: 'av1',
        name: 'Neon Bites',
        category: 'Snacks',
        imageUrl:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
        description:
          'Serving award-winning wagyu sliders and truffle fries throughout the event.',
      },
      {
        id: 'av2',
        name: 'Glow Threads',
        category: 'Merch',
        imageUrl:
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
        description:
          'Exclusive LED-imprinted apparel and limited-edition collaborations.',
      },
      {
        id: 'av3',
        name: 'Liquid Dreams',
        category: 'Drinks',
        imageUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        description:
          'Experience our signature Neon Mule and never-molded glow drinks.',
      },
      {
        id: 'av4',
        name: 'Prism Arts',
        category: 'Art',
        imageUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        description:
          'Browse and purchase unique digital collectibles and immersive physical pieces.',
      },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&h=160&fit=crop',
  },
  {
    id: 'e2',
    title: 'Future Tech Summit',
    category: 'Tech',
    registeredAt: '2026-08-10',
    organizerName: 'Jobberman',
    organizerEmail: 'jobberman@yahoo.com',
    organizerAvatarUrl: null,
    organizerJoined: '2024-08-05',
    bannerUrl:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&h=560&fit=crop',
    description:
      'A two-day summit on artificial intelligence, robotics, and sustainable infrastructure.',
    eventDate: '2026-12-04',
    eventTime: '10:00 AM – 05:00 PM',
    location: 'Eko Convention Center, Lagos',
    features: [
      { label: 'Live DJ Sets', icon: MusicNote03Icon },
      { label: 'Laser Show', icon: Idea01Icon },
    ],
    tiers: [
      {
        id: 't4',
        name: 'General Admission',
        detail: 'Tier 1 · Live',
        sold: 14,
        total: 500,
        price: 20_000,
        status: 'active',
      },
    ],
    vendors: [],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=160&h=160&fit=crop',
  },
]

const FLAGGED_ACTIVITIES: FlaggedActivity[] = [
  {
    id: 'f1',
    subjectType: 'organizer',
    date: '2026-10-28',
    reason: 'Fraud Suspicion',
    detail: 'Event cancellation after ticket bought',
  },
]

export function listPendingVendors() {
  return PENDING_VENDORS
}
export function getPendingVendor(id: string) {
  return PENDING_VENDORS.find((v) => v.id === id) ?? null
}

export function listPendingEvents() {
  return PENDING_EVENTS
}
export function getPendingEvent(id: string) {
  return PENDING_EVENTS.find((e) => e.id === id) ?? null
}

export function listFlaggedActivities() {
  return FLAGGED_ACTIVITIES
}
