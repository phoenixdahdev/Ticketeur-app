import Link from 'next/link'
import { Button } from '@useticketeur/ui/button'
import Image from 'next/image'

const GetStarted = () => {
  return (
    <div className="mx-auto flex max-w-[563px] flex-col items-center gap-6 px-4 text-center sm:gap-[42px]">
      <Image src="/logo.png" alt="Ticketeur Logo" width={132} height={120} />
      <h2 className="dark:text-foreground font-mono text-2xl leading-8 font-bold tracking-[0.5px] text-black sm:text-[36px] sm:leading-12">
        Ready to make your next event unforgettable?
      </h2>
      <p className="dark:text-foreground font-sans text-sm font-normal tracking-[0.75px] text-[#1E2028] sm:text-[15px] sm:leading-5">
        Welcome, we're here to turn your event planning into an effortless,
        enjoyable experience.
      </p>
      <Button
        className="flex h-12 w-full max-w-[189px] items-center justify-center gap-3 px-6 py-4 font-sans"
        asChild
      >
        <Link href="/signup">Get Started</Link>
      </Button>
    </div>
  )
}

export default GetStarted
