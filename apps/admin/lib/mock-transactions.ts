// Mock transaction data for admin work. Replace with tRPC once routers exist.

export type Transaction = {
  id: string
  reference: string
  attendeeName: string
  attendeeEmail: string
  attendeeAvatarUrl: string | null
  eventName: string
  eventDate: string
  eventTime: string
  eventLocation: string
  tier: string
  qty: number
  amount: number
  fee: number
  date: string
  paidAt: string
  paymentMethod: 'Card' | 'Transfer' | 'USSD'
}

const ATTENDEE_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop'

const TXNS: Transaction[] = [
  {
    id: 't1',
    reference: 'TXN-90218-MI',
    attendeeName: 'Julianne Devis',
    attendeeEmail: 'j.devis@gmail.com',
    attendeeAvatarUrl: ATTENDEE_AVATAR,
    eventName: 'Lagos Fest 2026',
    eventDate: '2024-11-12',
    eventTime: '09:00 AM – 06:00 PM',
    eventLocation: 'Main Ballroom, Convention Center',
    tier: 'Regular',
    qty: 1,
    amount: 5_000,
    fee: 500,
    date: '2024-08-05',
    paidAt: 'August 05, 2024 at 12:32:10 GMT',
    paymentMethod: 'Card',
  },
  {
    id: 't2',
    reference: 'TXN-90218-MI',
    attendeeName: 'Jane Doe',
    attendeeEmail: 'jane.doe@gmail.com',
    attendeeAvatarUrl: ATTENDEE_AVATAR,
    eventName: 'Chill Circle',
    eventDate: '2024-09-30',
    eventTime: '07:00 PM – 01:00 AM',
    eventLocation: 'Eko Hotels, Lagos',
    tier: 'Early bird',
    qty: 4,
    amount: 12_000,
    fee: 1_200,
    date: '2024-08-05',
    paidAt: 'August 05, 2024 at 12:32:10 GMT',
    paymentMethod: 'Card',
  },
  {
    id: 't3',
    reference: 'TXN-90218-MI',
    attendeeName: 'Jane Doe',
    attendeeEmail: 'jane.doe@gmail.com',
    attendeeAvatarUrl: ATTENDEE_AVATAR,
    eventName: 'The Future is Tech',
    eventDate: '2024-10-22',
    eventTime: '10:00 AM – 06:00 PM',
    eventLocation: 'Eko Convention Center',
    tier: 'VIP',
    qty: 1,
    amount: 15_000,
    fee: 1_500,
    date: '2024-08-05',
    paidAt: 'August 05, 2024 at 12:32:10 GMT',
    paymentMethod: 'Transfer',
  },
  {
    id: 't4',
    reference: 'TXN-90218-MI',
    attendeeName: 'Jane Doe',
    attendeeEmail: 'jane.doe@gmail.com',
    attendeeAvatarUrl: ATTENDEE_AVATAR,
    eventName: 'Chill Circle',
    eventDate: '2024-09-30',
    eventTime: '07:00 PM – 01:00 AM',
    eventLocation: 'Eko Hotels, Lagos',
    tier: 'Regular',
    qty: 3,
    amount: 30_000,
    fee: 3_000,
    date: '2024-08-05',
    paidAt: 'August 05, 2024 at 12:32:10 GMT',
    paymentMethod: 'Card',
  },
  {
    id: 't5',
    reference: 'TXN-90218-MI',
    attendeeName: 'Jane Doe',
    attendeeEmail: 'jane.doe@gmail.com',
    attendeeAvatarUrl: ATTENDEE_AVATAR,
    eventName: 'Asake Concert',
    eventDate: '2024-12-01',
    eventTime: '08:00 PM – Late',
    eventLocation: 'Tafawa Balewa Square',
    tier: 'Regular',
    qty: 2,
    amount: 20_000,
    fee: 2_000,
    date: '2024-08-05',
    paidAt: 'August 05, 2024 at 12:32:10 GMT',
    paymentMethod: 'Card',
  },
  {
    id: 't6',
    reference: 'TXN-90218-MI',
    attendeeName: 'Jane Doe',
    attendeeEmail: 'jane.doe@gmail.com',
    attendeeAvatarUrl: ATTENDEE_AVATAR,
    eventName: 'GTCO Fashion week',
    eventDate: '2024-11-25',
    eventTime: '04:00 PM – 10:00 PM',
    eventLocation: 'GTCO Plaza, Lagos',
    tier: 'VVIP',
    qty: 2,
    amount: 200_000,
    fee: 20_000,
    date: '2024-08-05',
    paidAt: 'August 05, 2024 at 12:32:10 GMT',
    paymentMethod: 'Card',
  },
  {
    id: 't7',
    reference: 'TXN-90218-MI',
    attendeeName: 'Jane Doe',
    attendeeEmail: 'jane.doe@gmail.com',
    attendeeAvatarUrl: ATTENDEE_AVATAR,
    eventName: 'Chill Circle',
    eventDate: '2024-09-30',
    eventTime: '07:00 PM – 01:00 AM',
    eventLocation: 'Eko Hotels, Lagos',
    tier: 'Early bird',
    qty: 1,
    amount: 6_000,
    fee: 600,
    date: '2024-08-05',
    paidAt: 'August 05, 2024 at 12:32:10 GMT',
    paymentMethod: 'USSD',
  },
]

export function listMockTransactions() {
  return TXNS
}

export function getMockTransaction(id: string) {
  return TXNS.find((t) => t.id === id) ?? null
}

export const TX_TOTAL_REVENUE = 24_512_000
export const TX_TOTAL_FEES = 2_451_200
