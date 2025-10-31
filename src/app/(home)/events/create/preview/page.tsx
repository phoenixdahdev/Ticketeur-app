import Breadcrumb from '~/components/miscellaneous/bread-crumb'
import { DashboardText } from '~/components/miscellaneous/dashboard-text'
export default function Page() {
  return (
    <div className="">
      <Breadcrumb
        items={[
          { label: 'One', href: '/dashboard/events/create' },
          { label: 'Two', href: '/dashboard/events/agenda' },
          { label: 'Three', href: '/dashboard/events/tickets' },
          { label: 'Four', href: '/dashboard/events/roles' },
          { label: 'Five', isCurrent: true },
        ]}
      />
      <DashboardText text="Overview" />
    </div>
  )
}
