// Mock event data for the admin events surface. Replace with tRPC once
// admin routers exist.

import type { IconSvgElement } from '@hugeicons/react'
import {
  MusicNote03Icon,
  Idea01Icon,
  DrinkIcon,
  UserGroupIcon,
  GameController01Icon,
} from '@hugeicons/core-free-icons'

export type AdminEventStatus = 'published' | 'archived' | 'flagged'

export type AdminEventRow = {
  id: string
  title: string
  reference: string
  organizerName: string
  date: string
  status: AdminEventStatus
  sold: number
  total: number
  thumbnailUrl: string
}

export type AdminEventTier = {
  id: string
  name: string
  detail: string
  sold: number
  total: number
  price: number
  status: 'sold-out' | 'active' | 'early'
}

export type AdminEventVendor = {
  id: string
  name: string
  category: string
  imageUrl: string
  description: string
}

export type AdminEventDetail = AdminEventRow & {
  description: string
  bannerUrl: string
  eventTime: string
  location: string
  features: { label: string; icon: IconSvgElement }[]
  totalRevenue: number
  revenueChangePct: number
  tiers: AdminEventTier[]
  vendors: AdminEventVendor[]
}

const THUMB =
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&h=160&fit=crop'
const BANNER =
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&h=560&fit=crop'

const FEATURES = [
  { label: 'Live DJ Sets', icon: MusicNote03Icon },
  { label: 'Laser Show', icon: Idea01Icon },
  { label: 'Open VIP Bar', icon: DrinkIcon },
  { label: 'Mascots', icon: UserGroupIcon },
  { label: 'Games', icon: GameController01Icon },
]

const VENDORS: AdminEventVendor[] = [
  {
    id: 'av1',
    name: 'Neon Bites',
    category: 'Food',
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
]

const TIERS: AdminEventTier[] = [
  {
    id: 'et1',
    name: 'Early Bird Pass',
    detail: 'Tier 1 · Ended Oct 31',
    sold: 250,
    total: 250,
    price: 99,
    status: 'sold-out',
  },
  {
    id: 'et2',
    name: 'General Admission',
    detail: 'Tier 2 · 5+ live',
    sold: 312,
    total: 600,
    price: 149,
    status: 'active',
  },
  {
    id: 'et3',
    name: 'VIP Networking Pass',
    detail: 'Tier 3 · Limited',
    sold: 88,
    total: 150,
    price: 299,
    status: 'early',
  },
]

const ROWS: AdminEventDetail[] = [
  {
    id: 'e1',
    title: 'Lagos Fest 2026',
    reference: '#EVT-29384',
    organizerName: 'Chill Circle',
    date: '2024-08-05',
    status: 'published',
    sold: 1_800,
    total: 2_000,
    thumbnailUrl: THUMB,
    description:
      'Join the brightest minds in tech for a day of innovation, networking, and expert-led sessions. This year\'s conference focuses on the intersection of Artificial Intelligence and Sustainable Infrastructure. Keynote speakers include industry pioneers from leading global tech firms.',
    bannerUrl: BANNER,
    eventTime: '09:00 AM – 06:00 PM',
    location: 'Main Ballroom, Convention Center',
    features: FEATURES,
    totalRevenue: 240_000,
    revenueChangePct: 30,
    tiers: TIERS,
    vendors: VENDORS,
  },
  {
    id: 'e2',
    title: 'Lagos Fest 2026',
    reference: '#EVT-29384',
    organizerName: 'Chill Circle',
    date: '2024-10-13',
    status: 'published',
    sold: 1_240,
    total: 2_000,
    thumbnailUrl: THUMB,
    description: 'Lorem ipsum.',
    bannerUrl: BANNER,
    eventTime: '08:00 PM – Late',
    location: 'Tafawa Balewa Square',
    features: FEATURES,
    totalRevenue: 180_000,
    revenueChangePct: 12,
    tiers: TIERS,
    vendors: VENDORS,
  },
  {
    id: 'e3',
    title: 'Lagos Fest 2026',
    reference: '#EVT-29384',
    organizerName: 'Chill Circle',
    date: '2024-06-04',
    status: 'flagged',
    sold: 1_240,
    total: 2_000,
    thumbnailUrl: THUMB,
    description: 'Lorem ipsum.',
    bannerUrl: BANNER,
    eventTime: '06:00 PM – 11:00 PM',
    location: 'Eko Convention Center',
    features: FEATURES,
    totalRevenue: 92_000,
    revenueChangePct: -3,
    tiers: TIERS,
    vendors: VENDORS,
  },
  {
    id: 'e4',
    title: 'Lagos Fest 2026',
    reference: '#EVT-29384',
    organizerName: 'Chill Circle',
    date: '2024-12-15',
    status: 'archived',
    sold: 5_000,
    total: 5_000,
    thumbnailUrl: THUMB,
    description: 'Lorem ipsum.',
    bannerUrl: BANNER,
    eventTime: '10:00 AM – 06:00 PM',
    location: 'Eko Convention Center',
    features: FEATURES,
    totalRevenue: 580_000,
    revenueChangePct: 0,
    tiers: TIERS,
    vendors: VENDORS,
  },
  {
    id: 'e5',
    title: 'Lagos Fest 2026',
    reference: '#EVT-29384',
    organizerName: 'Chill Circle',
    date: '2024-11-12',
    status: 'flagged',
    sold: 1_240,
    total: 2_000,
    thumbnailUrl: THUMB,
    description: 'Lorem ipsum.',
    bannerUrl: BANNER,
    eventTime: '07:00 PM – Midnight',
    location: 'Landmark Centre',
    features: FEATURES,
    totalRevenue: 68_000,
    revenueChangePct: -10,
    tiers: TIERS,
    vendors: VENDORS,
  },
  {
    id: 'e6',
    title: 'Lagos Fest 2026',
    reference: '#EVT-29384',
    organizerName: 'Chill Circle',
    date: '2024-05-21',
    status: 'published',
    sold: 1_240,
    total: 2_000,
    thumbnailUrl: THUMB,
    description: 'Lorem ipsum.',
    bannerUrl: BANNER,
    eventTime: '06:00 PM – 11:00 PM',
    location: 'Eko Convention Center',
    features: FEATURES,
    totalRevenue: 130_000,
    revenueChangePct: 8,
    tiers: TIERS,
    vendors: VENDORS,
  },
  {
    id: 'e7',
    title: 'Lagos Fest 2026',
    reference: '#EVT-29384',
    organizerName: 'Chill Circle',
    date: '2024-06-16',
    status: 'archived',
    sold: 12_000,
    total: 12_000,
    thumbnailUrl: THUMB,
    description: 'Lorem ipsum.',
    bannerUrl: BANNER,
    eventTime: '04:00 PM – 10:00 PM',
    location: 'GTCO Plaza',
    features: FEATURES,
    totalRevenue: 1_200_000,
    revenueChangePct: 0,
    tiers: TIERS,
    vendors: VENDORS,
  },
]

export const ADMIN_EVENT_STATS = {
  total: 4_100,
  active: 2_450,
  archived: 1_800,
  flagged: 850,
} as const

export function listAdminEvents() {
  return ROWS
}

export function getAdminEvent(id: string) {
  return ROWS.find((e) => e.id === id) ?? null
}
