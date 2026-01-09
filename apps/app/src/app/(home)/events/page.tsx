import { getEventsOptions } from '@/queries/events'
import { getQueryClient } from '@useticketeur/ui/query-client'
import EventPage from '.'

const EventsPage = async () => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(getEventsOptions())
  return <EventPage />
}

export default EventsPage
