import { AddAgendaForm } from './add_agenda_form'
import Breadcrumb from '@/components/miscellaneous/bread-crumb'
import { TypewriterEffectSmooth } from '@useticketeur/ui/typewriter-effect'

const CreateEventPage = () => {
  const words = [
    {
      text: 'Venue &',
      className: 'font-sans text-sm',
    },
    {
      text: 'Agenda Setup',
      className: 'font-sans text-sm',
    },
  ]
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'One', href: '/events/create' },
          { label: 'Two', isCurrent: true },
        ]}
      />
      <TypewriterEffectSmooth words={words} cursorClassName="hidden" />

      <AddAgendaForm />
    </>
  )
}

export default CreateEventPage
