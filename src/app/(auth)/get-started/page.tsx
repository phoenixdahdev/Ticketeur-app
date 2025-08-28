import Image from 'next/image'
import Link from 'next/link'
import { Button } from '~/components/ui/button'

const GetStarted = () => {
  return (
    <div className="mx-auto flex max-w-[563px] flex-col items-center gap-6 px-4 text-center sm:gap-[42px]">
      <h2 className="font-montserrat text-2xl leading-8 font-bold tracking-[0.5px] text-black sm:text-[36px] sm:leading-[48px]">
        👋 Welcome to Ticketeur
      </h2>
      <p className="font-nunito text-sm font-normal tracking-[0.75px] text-[#1E2028] sm:text-[15px] sm:leading-[20px]">
        Your all-in-one solution to create, manage, and grow your events—online
        or in person.
      </p>
      <Button
        className="flex h-12 w-full max-w-[189px] items-center justify-center gap-3 px-6 py-4"
        asChild
      >
        <Link href="/signup">Get Started</Link>
      </Button>
    </div>
  )
}

export default GetStarted
