import type { Metadata } from 'next'

import { CreateEventContent } from '@/components/dashboard/create-event/content'

export const metadata: Metadata = {
  title: 'Create Event',
  description: 'Set up your event details, ticketing, and manage vendors.',
}

export default function CreateEventPage() {
  return <CreateEventContent />
}
