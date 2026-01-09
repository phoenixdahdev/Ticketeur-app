import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { EventType, EventMemberRole, LocationType } from '@useticketeur/db'

// Basic Details - matches events table
export interface BasicDetails {
  title: string
  description: string
  banner_image: string | null
  event_type: EventType
  start_date: Date | null
  end_date: Date | null
  max_attendees: number | null
  is_free: boolean
}

// Venue & Agenda - matches events + event_sessions tables
export interface VenueDetails {
  location_type: LocationType
  venue_name: string
  venue_address: string
  country: string
  state: string
  city: string
  meeting_url: string | null
}

export interface SessionDetails {
  id?: string
  title: string
  description: string | null
  location: string | null
  start_time: Date | null
  end_time: Date | null
  track: string
  speaker_name: string | null
  speaker_image: string | null
}

// Ticketing - matches ticket_types table
export interface TicketTypeDetails {
  id?: string
  name: string
  description: string | null
  price: string
  quantity_available: number
  max_per_order: number
  sales_start: Date | null
  sales_end: Date | null
  is_active: boolean
  benefits: string[]
}

// Roles - matches event_members table
export interface RoleMember {
  id?: string
  name: string
  email: string
  role: EventMemberRole
  permissions: string[]
}

// Complete Event Store State
interface EventStoreState {
  // Step tracking
  currentStep: number

  // Basic Details
  basicDetails: BasicDetails

  // Venue & Agenda
  venue: VenueDetails
  sessions: SessionDetails[]

  // Ticketing
  ticketTypes: TicketTypeDetails[]

  // Roles
  members: RoleMember[]

  // Actions
  setCurrentStep: (step: number) => void
  setBasicDetails: (details: Partial<BasicDetails>) => void
  setVenue: (venue: Partial<VenueDetails>) => void
  addSession: (session: SessionDetails) => void
  updateSession: (index: number, session: Partial<SessionDetails>) => void
  removeSession: (index: number) => void
  setSessions: (sessions: SessionDetails[]) => void
  addTicketType: (ticket: TicketTypeDetails) => void
  updateTicketType: (index: number, ticket: Partial<TicketTypeDetails>) => void
  removeTicketType: (index: number) => void
  setTicketTypes: (tickets: TicketTypeDetails[]) => void
  addMember: (member: RoleMember) => void
  updateMember: (index: number, member: Partial<RoleMember>) => void
  removeMember: (index: number) => void
  setMembers: (members: RoleMember[]) => void
  resetStore: () => void
}

const initialBasicDetails: BasicDetails = {
  title: '',
  description: '',
  banner_image: null,
  event_type: 'other',
  start_date: null,
  end_date: null,
  max_attendees: null,
  is_free: false,
}

const initialVenue: VenueDetails = {
  location_type: 'physical',
  venue_name: '',
  venue_address: '',
  country: '',
  state: '',
  city: '',
  meeting_url: null,
}

const initialSession: SessionDetails = {
  title: '',
  description: null,
  location: null,
  start_time: null,
  end_time: null,
  track: '',
  speaker_name: null,
  speaker_image: null,
}

const initialTicketType: TicketTypeDetails = {
  name: '',
  description: null,
  price: '0',
  quantity_available: 100,
  max_per_order: 10,
  sales_start: null,
  sales_end: null,
  is_active: true,
  benefits: [],
}

const initialMember: RoleMember = {
  name: '',
  email: '',
  role: 'staff',
  permissions: [],
}

// Helper to convert date strings back to Date objects
const parseDate = (value: string | Date | null): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}

// Helper to parse stored state and restore Date objects
const parseStoredState = (state: EventStoreState): EventStoreState => {
  return {
    ...state,
    basicDetails: {
      ...state.basicDetails,
      start_date: parseDate(state.basicDetails.start_date),
      end_date: parseDate(state.basicDetails.end_date),
    },
    sessions: state.sessions.map((session) => ({
      ...session,
      start_time: parseDate(session.start_time),
      end_time: parseDate(session.end_time),
    })),
    ticketTypes: state.ticketTypes.map((ticket) => ({
      ...ticket,
      sales_start: parseDate(ticket.sales_start),
      sales_end: parseDate(ticket.sales_end),
    })),
  }
}

export const useEventStore = create<EventStoreState>()(
  persist(
    (set) => ({
      currentStep: 1,

      basicDetails: initialBasicDetails,
      venue: initialVenue,
      sessions: [{ ...initialSession }],
      ticketTypes: [{ ...initialTicketType }],
      members: [{ ...initialMember }],

      setCurrentStep: (step) => set({ currentStep: step }),

      setBasicDetails: (details) =>
        set((state) => ({
          basicDetails: { ...state.basicDetails, ...details },
        })),

      setVenue: (venue) =>
        set((state) => ({
          venue: { ...state.venue, ...venue },
        })),

      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),

      updateSession: (index, session) =>
        set((state) => ({
          sessions: state.sessions.map((s, i) =>
            i === index ? { ...s, ...session } : s
          ),
        })),

      removeSession: (index) =>
        set((state) => ({
          sessions: state.sessions.filter((_, i) => i !== index),
        })),

      setSessions: (sessions) => set({ sessions }),

      addTicketType: (ticket) =>
        set((state) => ({
          ticketTypes: [...state.ticketTypes, ticket],
        })),

      updateTicketType: (index, ticket) =>
        set((state) => ({
          ticketTypes: state.ticketTypes.map((t, i) =>
            i === index ? { ...t, ...ticket } : t
          ),
        })),

      removeTicketType: (index) =>
        set((state) => ({
          ticketTypes: state.ticketTypes.filter((_, i) => i !== index),
        })),

      setTicketTypes: (tickets) => set({ ticketTypes: tickets }),

      addMember: (member) =>
        set((state) => ({
          members: [...state.members, member],
        })),

      updateMember: (index, member) =>
        set((state) => ({
          members: state.members.map((m, i) =>
            i === index ? { ...m, ...member } : m
          ),
        })),

      removeMember: (index) =>
        set((state) => ({
          members: state.members.filter((_, i) => i !== index),
        })),

      setMembers: (members) => set({ members }),

      resetStore: () =>
        set({
          currentStep: 1,
          basicDetails: initialBasicDetails,
          venue: initialVenue,
          sessions: [{ ...initialSession }],
          ticketTypes: [{ ...initialTicketType }],
          members: [{ ...initialMember }],
        }),
    }),
    {
      name: 'ticketeur-event-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const parsed = parseStoredState(state)
          state.basicDetails = parsed.basicDetails
          state.sessions = parsed.sessions
          state.ticketTypes = parsed.ticketTypes
        }
      },
    }
  )
)

// Helper to create a new session
export const createEmptySession = (): SessionDetails => ({ ...initialSession })

// Helper to create a new ticket type
export const createEmptyTicketType = (): TicketTypeDetails => ({
  ...initialTicketType,
})

// Helper to create a new member
export const createEmptyMember = (): RoleMember => ({ ...initialMember })
