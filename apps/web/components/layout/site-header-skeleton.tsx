import { LogoIcon } from '@ticketur/ui/icons/logo-icon'
import { Skeleton } from '@ticketur/ui/components/skeleton'

export function SiteHeaderSkeleton() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b border-transparent">
      <div className="mx-auto flex h-18 w-full max-w-360 items-center justify-between px-4 md:h-21 md:px-10">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-9 w-auto md:h-10" />
          <span className="font-heading text-foreground text-xl font-semibold tracking-tight md:text-[22px]">
            Ticketeur
          </span>
        </div>

        <div className="hidden items-center gap-6 md:flex lg:gap-12">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-11 w-32 rounded-lg" />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-md" />
        </div>
      </div>
    </header>
  )
}
