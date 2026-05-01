// Mock data for admin user-management UI work. Replace with tRPC once
// admin routers exist.

export type UserStatus = 'active' | 'suspended' | 'disabled'
export type UserRole = 'attendee' | 'organizer' | 'vendor'

export type MockUserBase = {
  id: string
  name: string
  email: string
  role: UserRole
  joinedAt: string
  status: UserStatus
  avatarUrl?: string | null
}

export type TicketHistoryRow = {
  id: string
  eventName: string
  eventId: string
  category: string
  date: string
  tier: string
  qty: number
  amount: number
  thumbnailUrl: string
}

export type EventPortfolioRow = {
  id: string
  eventName: string
  eventId: string
  category: string
  date: string
  sold: number
  total: number
  status: 'active' | 'archived' | 'flagged'
  revenue: number
  thumbnailUrl: string
}

export type ParticipationRow = {
  id: string
  eventName: string
  eventId: string
  category: string
  date: string
  status: 'upcoming' | 'archived'
  thumbnailUrl: string
}

export type AttendeeDetail = MockUserBase & {
  role: 'attendee'
  eventsAttended: number
  ticketHistory: TicketHistoryRow[]
}

export type OrganizerDetail = MockUserBase & {
  role: 'organizer'
  logoUrl: string | null
  totalEvents: number
  activeCount: number
  archivedCount: number
  flaggedCount: number
  totalSold: number
  totalRevenue: number
  events: EventPortfolioRow[]
}

export type VendorDetail = MockUserBase & {
  role: 'vendor'
  logoUrl: string | null
  category: string
  description: string
  eventsParticipated: number
  verified: boolean
  showcase: string[]
  instagramUrl: string | null
  websiteUrl: string | null
  history: ParticipationRow[]
}

export type UserDetail = AttendeeDetail | OrganizerDetail | VendorDetail

const EVENT_THUMB =
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&h=160&fit=crop'

const SHOWCASE = Array.from(
  { length: 9 },
  () =>
    'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?w=400&h=400&fit=crop'
)

const ATTENDEE_TICKETS: TicketHistoryRow[] = [
  {
    id: 'a1',
    eventName: 'Lagos Fest 2026',
    eventId: '#EVT-29384',
    category: 'Music',
    date: '2024-08-05',
    tier: 'Regular',
    qty: 1,
    amount: 5_000,
    thumbnailUrl: EVENT_THUMB,
  },
  {
    id: 'a2',
    eventName: 'Lagos Fest 2026',
    eventId: '#EVT-29384',
    category: 'Music',
    date: '2024-10-13',
    tier: 'VIP',
    qty: 2,
    amount: 50_000,
    thumbnailUrl: EVENT_THUMB,
  },
  {
    id: 'a3',
    eventName: 'Lagos Fest 2026',
    eventId: '#EVT-29384',
    category: 'Music',
    date: '2024-06-04',
    tier: 'Early Bird',
    qty: 1,
    amount: 10_000,
    thumbnailUrl: EVENT_THUMB,
  },
  {
    id: 'a4',
    eventName: 'Lagos Fest 2026',
    eventId: '#EVT-29384',
    category: 'Music',
    date: '2024-05-21',
    tier: 'Regular',
    qty: 3,
    amount: 15_000,
    thumbnailUrl: EVENT_THUMB,
  },
]

const ORGANIZER_EVENTS: EventPortfolioRow[] = [
  {
    id: 'o1',
    eventName: 'Lagos Fest 2026',
    eventId: '#EVT-29384',
    category: 'Music',
    date: '2024-08-05',
    sold: 1_800,
    total: 2_000,
    status: 'active',
    revenue: 5_000,
    thumbnailUrl: EVENT_THUMB,
  },
  {
    id: 'o2',
    eventName: 'Lagos Fest 2026',
    eventId: '#EVT-29384',
    category: 'Music',
    date: '2024-10-13',
    sold: 1_800,
    total: 2_000,
    status: 'archived',
    revenue: 5_000,
    thumbnailUrl: EVENT_THUMB,
  },
  {
    id: 'o3',
    eventName: 'Lagos Fest 2026',
    eventId: '#EVT-29384',
    category: 'Music',
    date: '2024-06-04',
    sold: 1_800,
    total: 2_000,
    status: 'active',
    revenue: 5_000,
    thumbnailUrl: EVENT_THUMB,
  },
  {
    id: 'o4',
    eventName: 'Lagos Fest 2026',
    eventId: '#EVT-29384',
    category: 'Music',
    date: '2024-05-21',
    sold: 1_800,
    total: 2_000,
    status: 'flagged',
    revenue: 5_000,
    thumbnailUrl: EVENT_THUMB,
  },
]

const VENDOR_HISTORY: ParticipationRow[] = [
  {
    id: 'v1',
    eventName: 'Lagos Fest 2026',
    eventId: '#EVT-17104',
    category: 'Music',
    date: '2024-08-05',
    status: 'upcoming',
    thumbnailUrl: EVENT_THUMB,
  },
  {
    id: 'v2',
    eventName: 'Lagos Fest 2026',
    eventId: '#EVT-17104',
    category: 'Music',
    date: '2024-10-13',
    status: 'archived',
    thumbnailUrl: EVENT_THUMB,
  },
  {
    id: 'v3',
    eventName: 'Lagos Fest 2026',
    eventId: '#EVT-17104',
    category: 'Music',
    date: '2024-06-04',
    status: 'upcoming',
    thumbnailUrl: EVENT_THUMB,
  },
]

const USERS: UserDetail[] = [
  {
    id: '1',
    name: 'Julianne Devis',
    email: 'j.devis@inkstudio.com',
    role: 'attendee',
    joinedAt: '2024-08-05',
    status: 'active',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop',
    eventsAttended: 13,
    ticketHistory: ATTENDEE_TICKETS,
  },
  {
    id: '2',
    name: 'Abiola Ade',
    email: 'adeabiola@gmail.com',
    role: 'vendor',
    joinedAt: '2024-10-13',
    status: 'active',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop',
    logoUrl: null,
    category: 'Snacks',
    description:
      'Serving award-winning wagyu sliders and truffle fries throughout the event.',
    eventsParticipated: 125,
    verified: true,
    showcase: SHOWCASE,
    instagramUrl: 'instagram.com/neonbites',
    websiteUrl: null,
    history: VENDOR_HISTORY,
  },
  {
    id: '3',
    name: 'Matthias James',
    email: 'matthiasjames@yahoo.com',
    role: 'organizer',
    joinedAt: '2024-06-04',
    status: 'suspended',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop',
    logoUrl: null,
    totalEvents: 156,
    activeCount: 55,
    archivedCount: 100,
    flaggedCount: 1,
    totalSold: 24_650,
    totalRevenue: 23_986_560,
    events: ORGANIZER_EVENTS,
  },
  {
    id: '4',
    name: 'Tasty Bites',
    email: 'tastybites@gmail.com',
    role: 'vendor',
    joinedAt: '2024-08-05',
    status: 'active',
    avatarUrl: null,
    logoUrl: null,
    category: 'Snacks',
    description:
      'Serving award-winning wagyu sliders and truffle fries throughout the event.',
    eventsParticipated: 125,
    verified: true,
    showcase: SHOWCASE,
    instagramUrl: 'instagram.com/neonbites',
    websiteUrl: null,
    history: VENDOR_HISTORY,
  },
  {
    id: '5',
    name: 'Jobberman',
    email: 'jobberman@yahoo.com',
    role: 'organizer',
    joinedAt: '2024-08-05',
    status: 'active',
    avatarUrl: null,
    logoUrl: null,
    totalEvents: 156,
    activeCount: 55,
    archivedCount: 100,
    flaggedCount: 1,
    totalSold: 24_650,
    totalRevenue: 23_986_560,
    events: ORGANIZER_EVENTS,
  },
]

export function getMockUser(id: string): UserDetail | null {
  return USERS.find((u) => u.id === id) ?? null
}

export function listMockUsers(): UserDetail[] {
  return USERS
}
