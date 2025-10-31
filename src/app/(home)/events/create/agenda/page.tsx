import Breadcrumb from '~/components/miscellaneous/bread-crumb'
import { DashboardText } from '~/components/miscellaneous/dashboard-text'
import { AddAgendaForm } from './add_agenda_form'

export default function Page() {
  return (
    <div className="">
      <Breadcrumb
        items={[
          { label: 'One', href: '/dashboard/events/create' },
          { label: 'Two', isCurrent: true },
        ]}
      />
      <DashboardText text="Venue & Agenda Setup" />
      <AddAgendaForm/>
    </div>
  )
}
