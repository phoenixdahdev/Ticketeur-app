import Breadcrumb from '@/components/miscellaneous/bread-crumb'
import { CreateTicketForm } from './create_ticket_form'
import { TypewriterEffectSmooth } from '@useticketeur/ui/typewriter-effect'
export default function Page() {
  const words = [
    {
      text: 'Ticketing &',
      className: 'font-sans text-sm',
    },
    {
      text: 'Access',
      className: 'font-sans text-sm',
    },
  ]
  return (
    <div className="">
      <Breadcrumb
        items={[
          { label: 'One', href: '/events/create' },
          { label: 'Two', href: '/events/create/agenda' },
          { label: 'Three', isCurrent: true },
        ]}
      />
      <TypewriterEffectSmooth words={words} cursorClassName="hidden" />
      <CreateTicketForm />
    </div>
  )
}
