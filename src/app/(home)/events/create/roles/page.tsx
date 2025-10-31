import Breadcrumb from '~/components/miscellaneous/bread-crumb'
import { DashboardText } from '~/components/miscellaneous/dashboard-text'
import { CreateRoleForm } from './create_role_form'
export default function Page() {
  return (
    <div className="">
      <Breadcrumb
        items={[
          { label: 'One', href: '/dashboard/events/create' },
          { label: 'Two', href: '/dashboard/events/agenda' },
          { label: 'Three', href: '/dashboard/events/tickets' },
          { label: 'Four', isCurrent: true },
        ]}
      />
          <DashboardText text="Roles" />
          <CreateRoleForm/>
    </div>
  )
}
