import Link from 'next/link'
import Image from 'next/image'
import { LogoIcon } from '@ticketur/ui/icons/logo-icon'

type AuthShellProps = {
  imageSrc: string
  imageMobileSrc: string
  imageAlt: string
  children: React.ReactNode
}

export function AuthShell({
  imageSrc,
  imageMobileSrc,
  imageAlt,
  children,
}: AuthShellProps) {
  return (
    <div className="dark:bg-background flex min-h-svh flex-col bg-[#fafafa] md:h-svh md:flex-row md:overflow-hidden">
      <aside className="relative h-[52vh] w-full shrink-0 overflow-hidden sm:h-[56vh] md:h-full md:w-1/2 lg:w-[55%]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 55vw, (min-width: 768px) 50vw, 0px"
          className="hidden object-cover md:block"
        />
        <Image
          src={imageMobileSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 768px) 0px, 100vw"
          className="object-cover md:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/30 to-transparent md:hidden"
        />
        <Link
          href="/"
          aria-label="Ticketur home"
          className="bg-background/95 absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-xl px-3 py-2 shadow-sm backdrop-blur md:top-6 md:left-6"
        >
          <LogoIcon className="h-7 w-auto" />
          <span className="font-heading text-foreground text-base font-semibold tracking-tight">
            Ticketur
          </span>
        </Link>
      </aside>

      <section className="bg-background relative z-10 -mt-8 flex flex-1 flex-col rounded-t-3xl md:mt-0 md:-ml-8 md:h-full md:overflow-y-auto md:rounded-t-none md:rounded-l-[35px]">
        <div className="mx-auto flex w-full max-w-140 flex-col gap-8 px-6 py-10 md:my-auto md:px-14 md:py-14">
          {children}
        </div>
      </section>
    </div>
  )
}
