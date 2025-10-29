'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '~/lib/utils'

interface TourStepProps {
  step: {
    step: number
    title: string
    subtitle: string
    description: string
    image: string
    icon: string
  }
  totalSteps: number
  currentStep: number
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
  onFinish: () => void
}

export default function TourStep({
  step,
  totalSteps,
  currentStep,
  onNext,
  onSkip,
  onFinish,
}: TourStepProps) {
  const isLastStep = currentStep === totalSteps

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="flex min-h-screen w-full items-center justify-center px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="w-full max-w-xl">
        <motion.div className="mb-8" variants={itemVariants}>
          <p className="text-muted-foreground mb-3 text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </p>

          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <motion.div
                key={index}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  index < currentStep
                    ? 'bg-foreground'
                    : index === currentStep
                      ? 'bg-foreground'
                      : 'bg-border'
                )}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div className="mb-6" variants={itemVariants}>
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            {step.title}
          </h1>
          <p className="text-muted-foreground text-sm">{step.subtitle}</p>
        </motion.div>

        <motion.div
          className="bg-muted relative mb-8 h-48 overflow-hidden rounded-lg"
          variants={imageVariants}
        >
          <Image
            src={step.image || '/placeholder.svg'}
            alt={step.title}
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          className="mb-8 flex items-start gap-3"
          variants={itemVariants}
        >
          <span className="shrink-0 text-2xl">{step.icon}</span>
          <div>
            <h2 className="text-foreground mb-1 font-semibold">{step.title}</h2>
            <p className="text-muted-foreground text-sm">{step.description}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div className="space-y-3" variants={itemVariants}>
          <button
            onClick={isLastStep ? onFinish : onNext}
            className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-purple-700"
          >
            {isLastStep ? 'Finish Setup' : 'Next'}
          </button>
          <button
            onClick={onSkip}
            className="text-foreground hover:text-muted-foreground w-full py-2 text-sm font-medium transition-colors"
          >
            Skip for now
          </button>
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center gap-2"
          variants={itemVariants}
        >
          {Array.from({ length: totalSteps }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {}}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentStep - 1
                  ? 'bg-foreground w-6'
                  : 'bg-border hover:bg-muted-foreground w-2'
              )}
              aria-label={`Go to step ${index + 1}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
