import Link from 'next/link'

import { LogoIcon } from '@ticketur/ui/icons/logo-icon'
import { ThemeToggle } from '@/components/misc/theme-toggle'

export function AuthHeader() {
  return (
    <header className="bg-background border-border/60 sticky top-0 z-40 w-full border-b">
      <div className="mx-auto flex h-18 w-full max-w-360 items-center justify-between px-4 md:px-10">
        <Link
          href="/"
          aria-label="Ticketeur home"
          className="group flex items-center gap-2"
        >
          <LogoIcon className="h-9 w-auto md:h-10" />
          <span className="font-heading text-foreground text-xl font-semibold tracking-tight md:text-[22px]">
            Ticketeur
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
