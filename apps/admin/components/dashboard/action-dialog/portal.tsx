'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'
import { Textarea } from '@ticketur/ui/components/textarea'
import { Label } from '@ticketur/ui/components/label'

import {
  useActionDialogStore,
  type ActionDialogTone,
  type DialogState,
} from './store'

export function ActionDialogPortal() {
  const state = useActionDialogStore((s) => s.state)
  const cancel = useActionDialogStore((s) => s.cancel)
  const resolveConfirm = useActionDialogStore((s) => s.resolveConfirm)
  const resolvePrompt = useActionDialogStore((s) => s.resolvePrompt)

  // Lock background scroll + ESC to dismiss while a dialog is open.
  useEffect(() => {
    if (!state) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') cancel()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      window.removeEventListener('keydown', onKey)
    }
  }, [state, cancel])

  return (
    <AnimatePresence>
      {state ? (
        <motion.div
          key="action-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={state.title}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={cancel}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="bg-background border-border/60 relative z-10 flex w-full max-w-md flex-col gap-5 rounded-2xl border p-6 shadow-2xl shadow-black/20"
          >
            {state.kind === 'confirm' ? (
              <ConfirmBody
                state={state}
                onCancel={cancel}
                onConfirm={() => resolveConfirm(true)}
              />
            ) : (
              <PromptBody
                state={state}
                onCancel={cancel}
                onConfirm={(value) => resolvePrompt(value)}
              />
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function ConfirmBody({
  state,
  onCancel,
  onConfirm,
}: {
  state: Extract<DialogState, { kind: 'confirm' }>
  onCancel: () => void
  onConfirm: () => void
}) {
  const confirmRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    confirmRef.current?.focus()
  }, [])

  return (
    <>
      <Header title={state.title} description={state.description} />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" size="lg" onClick={onCancel}>
          {state.cancelLabel ?? 'Cancel'}
        </Button>
        <Button
          ref={confirmRef}
          type="button"
          size="lg"
          onClick={onConfirm}
          className={toneClass(state.tone)}
        >
          {state.confirmLabel ?? 'Confirm'}
        </Button>
      </div>
    </>
  )
}

function PromptBody({
  state,
  onCancel,
  onConfirm,
}: {
  state: Extract<DialogState, { kind: 'prompt' }>
  onCancel: () => void
  onConfirm: (value: string) => void
}) {
  const [value, setValue] = useState(state.initialValue ?? '')
  const ref = useRef<HTMLTextAreaElement>(null)
  const id = useRef(
    `action-dialog-input-${Math.random().toString(36).slice(2, 8)}`
  ).current

  useEffect(() => {
    ref.current?.focus()
  }, [])

  function submit() {
    if (state.required && value.trim().length === 0) {
      ref.current?.focus()
      return
    }
    onConfirm(value)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="flex flex-col gap-5"
    >
      <Header title={state.title} description={state.description} />
      <div className="flex flex-col gap-2">
        {state.inputLabel ? (
          <Label htmlFor={id} className="text-sm font-semibold">
            {state.inputLabel}
          </Label>
        ) : null}
        <Textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={state.placeholder}
          rows={state.multiline === false ? 2 : 4}
          onKeyDown={(e) => {
            // Cmd/Ctrl+Enter submits so multi-line line breaks still work.
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault()
              submit()
            }
          }}
        />
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" size="lg" onClick={onCancel}>
          {state.cancelLabel ?? 'Cancel'}
        </Button>
        <Button type="submit" size="lg" className={toneClass(state.tone)}>
          {state.confirmLabel ?? 'Save'}
        </Button>
      </div>
    </form>
  )
}

function Header({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <header className="flex flex-col gap-1.5">
      <h2 className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </header>
  )
}

function toneClass(tone: ActionDialogTone | undefined) {
  return cn(
    tone === 'danger' && 'bg-rose-500 text-white hover:bg-rose-600',
    tone === 'warning' && 'bg-amber-500 text-white hover:bg-amber-600',
    tone === 'success' && 'bg-emerald-500 text-white hover:bg-emerald-600'
  )
}
