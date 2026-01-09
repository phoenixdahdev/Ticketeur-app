'use client'

import { getEventsOptions } from '@/queries/events'
import { useQuery } from '@tanstack/react-query'

const EventPage = () => {
  const {} = useQuery(getEventsOptions())
  return <div>EventPage</div>
}

export default EventPage
