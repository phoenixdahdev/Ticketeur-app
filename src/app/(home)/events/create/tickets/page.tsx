import Breadcrumb from '~/components/miscellaneous/bread-crumb'
import { DashboardText } from '~/components/miscellaneous/dashboard-text'
import { CreateTicketForm } from './create_ticket_form'
export default function Page() {
  return (
    <div className="">
      <Breadcrumb
        items={[
          { label: 'One', href: '/dashboard/events/create' },
          { label: 'Two', href: '/dashboard/events/agenda' },
          { label: 'Three', isCurrent: true },
        ]}
      />
      <DashboardText text="Ticketing & Access" />
      <CreateTicketForm/>
    </div>
  )
}
