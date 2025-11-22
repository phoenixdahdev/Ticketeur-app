'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, BarChart3 } from 'lucide-react'
import { cn } from '@useticketeur/ui/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Events',
    href: '/dashboard/my-events',
    icon: Calendar,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar ">
      <div className='py-6'>
        <div className="px-4 items-center justify-center gap-3 ">
          <Image
            src="/logo.png"
            alt="Ticketeur Logo"
            width={150}
            height={150}
            className="object-contain"
            />
        </div>
          </div>
      <nav className="flex-1 space-y-4 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="size-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

