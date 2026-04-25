import type { Metadata } from 'next'

import { EventsContent } from '@/components/dashboard/events-content'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Track, manage and edit your scheduled events.',
}

export default function OrgEventsPage() {
  return <EventsContent />
}
