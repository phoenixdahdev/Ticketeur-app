'use client'

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react'
import { useRef, useState } from 'react'

const SCROLL_THRESHOLD = 800

export function GoToTop() {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  const lastY = useRef(0)

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = lastY.current
    const direction = current > previous ? 'down' : 'up'
    const pastThreshold = current > SCROLL_THRESHOLD
    setVisible(pastThreshold && direction === 'up')
    lastY.current = current
  })

  const handleClick = () => {
    window.scroll({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="go-to-top"
          type="button"
          aria-label="Scroll to top"
          onClick={handleClick}
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="fixed right-3 bottom-14 z-50 grid size-11 place-items-center rounded-full border border-white bg-white mix-blend-difference shadow-[0_0_40px_0_rgba(0,0,0,0.16)] select-none sm:right-5 sm:bottom-16 sm:size-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6 mix-blend-difference sm:size-7"
            aria-hidden
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
