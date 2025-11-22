import { CreateEventForm } from './create_event_form'
import Breadcrumb from '@/components/miscellaneous/bread-crumb'
import { eventTypes } from '@useticketeur/db'
import { TypewriterEffectSmooth } from '@useticketeur/ui/typewriter-effect'

const CreateEventPage = () => {
  const words = [
    {
      text: 'Basic',
      className: 'font-sans text-sm',
    },
    {
      text: 'Details',
      className: 'font-sans text-sm',
    },
  ]
  return (
    <>
      <Breadcrumb items={[{ label: 'One', isCurrent: true }]} />
      <TypewriterEffectSmooth words={words} />

      <CreateEventForm eventTypes={[...eventTypes]} />
    </>
  )
}

export default CreateEventPage
