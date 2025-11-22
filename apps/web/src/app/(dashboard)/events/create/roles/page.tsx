import Breadcrumb from '@/components/miscellaneous/bread-crumb'
import { CreateRoleForm } from './create_role_form'
import { TypewriterEffectSmooth } from '@useticketeur/ui/typewriter-effect'
import { eventMemberRoles } from '@useticketeur/db'
export default function Page() {
  const words = [
    {
      text: 'Roles',
      className: 'font-sans text-sm',
    },
  ]
  return (
    <div className="">
      <Breadcrumb
        items={[
          { label: 'One', href: '/events/create' },
          { label: 'Two', href: '/events/create/agenda' },
          { label: 'Three', href: '/events/create/tickets' },
          { label: 'Four', isCurrent: true },
        ]}
      />
      <TypewriterEffectSmooth words={words} cursorClassName="hidden" />
      <CreateRoleForm eventMemberRoles={[...eventMemberRoles]} />
    </div>
  )
}
