'use client'

import Image from 'next/image'
import { motion } from 'motion/react'

import { EventSearchBar } from './event-search-bar'

export function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative isolate w-full overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full"
        >
          <Image
            src="/hero-bg-mobile.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 0px"
            className="object-cover md:hidden"
          />
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 100vw, 0px"
            className="hidden object-cover md:block"
          />
        </motion.div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/55 md:from-black/45 md:via-black/25 md:to-black/45"
        />
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center px-5 pt-16 pb-24 md:px-10 md:pt-24 md:pb-32">
        <div className="flex min-h-[520px] w-full flex-col items-center justify-center gap-8 text-center md:min-h-[540px] md:gap-12">
          <div className="flex flex-col items-center gap-2 md:max-w-[801px] md:gap-6">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-[32px] leading-[1.25] font-bold tracking-tight text-balance text-white md:text-[56px] md:leading-[1.2]"
            >
              Find Secured Tickets to the Best Events
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="md:font-heading max-w-[640px] font-sans text-sm font-medium text-balance text-white/90 md:text-xl md:font-semibold md:text-slate-200"
            >
              Experience the safest way to buy and sell tickets for all kinds of
              events.
            </motion.p>
          </div>

          <EventSearchBar />
        </div>
      </div>
    </section>
  )
}
