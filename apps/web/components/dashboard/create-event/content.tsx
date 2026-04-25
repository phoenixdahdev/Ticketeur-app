'use client'

import { useState } from 'react'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { toast } from 'sonner'

import {
  CREATE_EVENT_DEFAULTS,
  type CreateEventValues,
} from '@/lib/create-event-schema'

import { FormView } from '@/components/dashboard/create-event/form-view'
import { PreviewView } from '@/components/dashboard/create-event/preview-view'
import { SubmitModal } from '@/components/dashboard/create-event/submit-modal'

const STEP_VALUES = ['form', 'preview'] as const

export function CreateEventContent() {
  const [step, setStep] = useQueryState(
    'step',
    parseAsStringLiteral(STEP_VALUES).withDefault('form')
  )
  const [values, setValues] = useState<CreateEventValues>(CREATE_EVENT_DEFAULTS)
  const [banner, setBanner] = useState<string | null>(null)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleSaveDraft() {
    toast.success('Draft saved', {
      description: 'Your event has been saved as a draft.',
    })
  }

  function handleSubmit() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitOpen(true)
    }, 500)
  }

  return (
    <>
      {step === 'preview' ? (
        <PreviewView
          values={values}
          banner={banner}
          onEdit={() => void setStep('form')}
          onCancel={() => void setStep('form')}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      ) : (
        <FormView
          values={values}
          onChange={setValues}
          banner={banner}
          onBannerChange={setBanner}
          onPreview={() => void setStep('preview')}
          onSaveDraft={handleSaveDraft}
        />
      )}
      <SubmitModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </>
  )
}
