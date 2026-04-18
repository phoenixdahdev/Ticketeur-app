'use client'

import { motion } from 'motion/react'

export function AnimatedShield({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 320 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Moderated shield"
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <defs>
        <clipPath id="shield-shape">
          <path d="M160 28c-33 0-63 9-92 20-7 3-12 10-12 18v96c0 66 49 115 97 136l7 4 7-4c48-21 97-70 97-136V66c0-8-5-15-12-18-29-11-59-20-92-20Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#shield-shape)">
        {/* top-left */}
        <motion.rect
          x="0"
          y="0"
          width="160"
          height="160"
          fill="oklch(0.92 0.08 290)"
          variants={{
            hidden: { opacity: 0, x: -40 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.05,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        />
        {/* top-right */}
        <motion.rect
          x="160"
          y="0"
          width="160"
          height="160"
          fill="var(--primary)"
          variants={{
            hidden: { opacity: 0, x: 40 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.15,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        />
        {/* bottom-left */}
        <motion.rect
          x="0"
          y="160"
          width="160"
          height="160"
          fill="var(--primary)"
          variants={{
            hidden: { opacity: 0, x: -40 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.25,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        />
        {/* bottom-right */}
        <motion.rect
          x="160"
          y="160"
          width="160"
          height="160"
          fill="oklch(0.92 0.08 290)"
          variants={{
            hidden: { opacity: 0, x: 40 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.35,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        />
      </g>

      {/* crease lines for the 4-segment fold */}
      <motion.g
        stroke="var(--primary)"
        strokeWidth="2"
        strokeOpacity="0.25"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              delay: 0.5,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
      >
        <motion.path d="M160 28v264" fill="none" />
        <motion.path d="M56 160h208" fill="none" />
      </motion.g>
    </motion.svg>
  )
}
