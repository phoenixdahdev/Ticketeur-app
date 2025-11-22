import Breadcrumb from '@/components/miscellaneous/bread-crumb'
import { TypewriterEffectSmooth } from '@useticketeur/ui/typewriter-effect'

export default function Page() {
  const words = [
    {
      text: 'Overview',
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
          { label: 'Four', href: '/events/create/roles' },
          { label: 'Five', isCurrent: true },
        ]}
      />
      <TypewriterEffectSmooth words={words} cursorClassName="hidden" />
    </div>
  )
}
