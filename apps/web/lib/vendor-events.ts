export type VendorEventStatus = 'live' | 'upcoming' | 'past'

export type VendorEventCategory = 'MUSIC' | 'TECH' | 'ART' | 'FASHION' | 'FOOD'

export type VendorEvent = {
  id: string
  title: string
  date: string
  dateMs: number
  time: string
  location: string
  category: VendorEventCategory
  status: VendorEventStatus
  image: string
  description: string
  features: string[]
  venue: string
  weekday: string
}

function mk(
  id: string,
  title: string,
  isoDate: string,
  time: string,
  location: string,
  venue: string,
  category: VendorEventCategory,
  status: VendorEventStatus,
  image: string,
  description: string,
  features: string[]
): VendorEvent {
  const d = new Date(`${isoDate}T00:00:00`)
  return {
    id,
    title,
    date: d.toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    }),
    dateMs: d.getTime(),
    time,
    location,
    venue,
    category,
    status,
    image,
    description,
    features,
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
  }
}

const FEATURE_DEFAULTS = ['Live DJ Sets', 'Laser Show', 'Open VIP Bar', 'Mascots', 'Games']

export const VENDOR_EVENTS: VendorEvent[] = [
  mk(
    'lagos-fest-2026',
    'Lagos Fest 2026',
    '2026-10-21',
    '09:00 AM - 06:00 PM',
    'Gbagada, Lagos',
    'Tafawa Balewa Square',
    'MUSIC',
    'live',
    '/vendor/event-music.jpg',
    'A celebration of west african rhythm and culture — three stages, twenty headliners, food and craft markets across the festival grounds.',
    FEATURE_DEFAULTS
  ),
  mk(
    'future-tech-summit',
    'Future Tech Summit',
    '2026-03-15',
    '09:00 AM - 05:30 PM',
    'Westlands, Lagos Island',
    'Eko Convention Centre',
    'TECH',
    'upcoming',
    '/vendor/event-tech.jpg',
    'Two days of keynotes, workshops and demos at the intersection of AI, infrastructure and product. Curated networking dinners each evening.',
    FEATURE_DEFAULTS
  ),
  mk(
    'cape-town-art-expo',
    'Cape Town Art Expo',
    '2026-07-09',
    '10:00 AM - 04:00 PM',
    'Victoria Island, Lagos Island',
    'Pavilion 4, Eko Hotel',
    'ART',
    'upcoming',
    '/vendor/event-art.jpg',
    "Visual artists from across the continent showcase original work and limited prints. Live painting demos throughout the day.",
    FEATURE_DEFAULTS
  ),
  mk(
    'gtco-fashion-week',
    'GTCO Fashion Week',
    '2026-10-21',
    '04:00 PM - 12:00 AM',
    'Gbagada, Lagos',
    'Federal Palace Hotel',
    'FASHION',
    'past',
    '/vendor/event-fashion.jpg',
    'Six runway shows from emerging Nigerian designers — closing night street-style afterparty open to all attendees.',
    FEATURE_DEFAULTS
  ),
]

export const VENDOR_EVENTS_PAGE_SIZE = 4

export const VENDOR_STATS = {
  totalEvents: 16,
  upcomingEvents: 4,
  pastEvents: 12,
  profileCompletion: 85,
}

export function findVendorEvent(id: string): VendorEvent | undefined {
  return VENDOR_EVENTS.find((e) => e.id === id)
}

export const VENDOR_CATEGORY_LABEL: Record<VendorEventCategory, string> = {
  MUSIC: 'MUSIC',
  TECH: 'TECH',
  ART: 'ART',
  FASHION: 'FASHION',
  FOOD: 'FOOD',
}
