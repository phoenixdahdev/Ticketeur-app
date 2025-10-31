import Breadcrumb from '~/components/miscellaneous/bread-crumb'
import { DashboardText } from '~/components/miscellaneous/dashboard-text'
import { CreateEventForm } from './create_event_form'

export default function Page() {
  return (
    <div className="">
      <Breadcrumb items={[{ label: 'One', isCurrent: true }]} />
      <DashboardText text="Basic Details" />
      <CreateEventForm />
    </div>
  )
}
