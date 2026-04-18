'use client'

import { motion } from 'motion/react'

const STEPS = [
  {
    num: 1,
    title: 'Create Account',
    description:
      'Sign up as a professional organiser and verify your credentials.',
  },
  {
    num: 2,
    title: 'List Event',
    description:
      'Input your event details, schedule, and configure ticket tiers.',
  },
  {
    num: 3,
    title: 'Assign Vendors',
    description:
      'Browse and choose from our verified vendor pool for your venue.',
  },
  {
    num: 4,
    title: 'Sell Tickets',
    description:
      'Go live and start reaching attendees through our secure checkout.',
  },
] as const

export function OrganisersPath() {
  return (
    <section
      aria-labelledby="organisers-path-title"
      className="w-full px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 md:gap-16">
        <motion.h2
          id="organisers-path-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-center md:text-[40px] md:leading-[1.15]"
        >
          Your Path to a Successful Event
        </motion.h2>

        <div className="relative">
          <div className="hidden md:block">
            <DesktopConnector />
          </div>

          <ol className="flex flex-col gap-8 md:grid md:grid-cols-4 md:gap-6">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex items-start gap-6 md:flex-col md:items-center md:gap-6 md:text-center"
              >
                {/* Mobile vertical connecting line */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-20 left-10 h-[calc(100%+2rem)] w-[2px] bg-[#ededed] md:hidden dark:bg-white/10"
                  />
                )}

                <motion.div
                  whileHover={{ scale: 1.08, rotate: -6 }}
                  transition={{
                    type: 'spring',
                    stiffness: 360,
                    damping: 18,
                  }}
                  className="bg-primary text-primary-foreground shadow-primary/30 relative z-10 flex size-20 shrink-0 items-center justify-center rounded-full shadow-lg"
                >
                  <span className="font-heading text-2xl font-bold">
                    {step.num}
                  </span>
                </motion.div>

                <div className="flex flex-col gap-2 pt-4 md:pt-0">
                  <h3 className="font-heading text-foreground text-xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed md:text-[0.95rem]">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function DesktopConnector() {
  return (
    <motion.span
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: '0% 50%' }}
      className="absolute top-10 right-[12.5%] left-[12.5%] h-[2px] -translate-y-1/2 rounded-full bg-[#ededed] dark:bg-white/10"
    />
  )
}
