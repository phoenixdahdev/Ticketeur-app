'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import TourStep from '../tour-step'
import { useRouter } from '@bprogress/next/app'

const tourSteps = [
  {
    step: 1,
    title: 'Create Events Effortlessly',
    subtitle: "Here's how it works 🎯",
    description: 'Set up and customize your event in minutes.',
    image: '/tour-1.png',
    icon: '✅',
  },
  {
    step: 2,
    title: 'Get Paid Securely',
    subtitle: "Here's how it works 🎯",
    description: 'Enjoy fast, secure payouts to your bank.',
    image: '/tour2.png',
    icon: '💳',
  },
  {
    step: 3,
    title: 'Sell Tickets',
    subtitle: "Here's how it works 🎯",
    description: 'Offer flexible ticket options',
    image: '/tour3.png',
    icon: '🎫',
  },
  {
    step: 4,
    title: 'Track Sales & Engagement',
    subtitle: "Here's how it works 🎯",
    description: 'Get real-time insights to grow your events.',
    image: '/tour4.png',
    icon: '📊',
  },
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % tourSteps.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay])

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % tourSteps.length)
    setAutoPlay(false)
  }

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1 + tourSteps.length) % tourSteps.length)
    setAutoPlay(false)
  }

  const handleSkip = () => {
    setAutoPlay(false)
    router.push('/')
  }

  const handleFinish = () => {
    setAutoPlay(false)
    router.push('/')
  }

  return (
    <AnimatePresence mode="wait">
      <TourStep
        key={currentStep}
        step={tourSteps[currentStep]}
        totalSteps={tourSteps.length}
        currentStep={currentStep + 1}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={handleSkip}
        onFinish={handleFinish}
      />
    </AnimatePresence>
  )
}
