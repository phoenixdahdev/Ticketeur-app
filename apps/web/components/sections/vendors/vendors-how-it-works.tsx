'use client'

import { motion } from 'motion/react'

const STEPS = [
  {
    num: 1,
    title: 'Create Profile',
    description:
      'Set up your profile with your logo, brand story and product description.',
  },
  {
    num: 2,
    title: 'Get Verified',
    description:
      'Application is reviewed to ensure marketplace quality and brand alignment.',
  },
  {
    num: 3,
    title: 'Connect with Organizers',
    description:
      'Get discovered and assigned to relevant upcoming events by top organizers.',
  },
  {
    num: 4,
    title: 'Showcase Your Brand',
    description:
      'Build visibility, interact with customers and reach new audiences on-site.',
  },
] as const

export function VendorsHowItWorks() {
  return (
    <section
      aria-labelledby="vendors-how-title"
      className="w-full px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 md:gap-16">
        <motion.h2
          id="vendors-how-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-[40px] md:leading-[1.15]"
        >
          How it Works
        </motion.h2>

        <ol className="relative mx-auto flex w-full max-w-[840px] flex-col gap-10">
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 1.1,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: '50% 0%' }}
            className="absolute top-10 bottom-10 left-[23px] w-[2px] bg-[#ededed] md:left-[37px] dark:bg-white/10"
          />
          {STEPS.map((step, i) => (
            <motion.li
              key={step.num}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: 0.15 + i * 0.12,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex items-start gap-5 md:gap-8"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: -6 }}
                transition={{
                  type: 'spring',
                  stiffness: 360,
                  damping: 18,
                }}
                className="bg-primary text-primary-foreground shadow-primary/30 relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full shadow-lg md:size-[76px]"
              >
                <span className="font-heading text-lg font-bold md:text-2xl">
                  {step.num}
                </span>
              </motion.div>
              <div className="flex flex-1 flex-col gap-1.5 pt-1 md:gap-2 md:pt-4">
                <h3 className="font-heading text-foreground text-lg font-semibold tracking-tight md:text-xl">
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
    </section>
  )
}
