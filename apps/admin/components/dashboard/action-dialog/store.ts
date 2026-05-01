'use client'

import { create } from 'zustand'

export type ActionDialogTone = 'default' | 'danger' | 'warning' | 'success'

export type ConfirmOptions = {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: ActionDialogTone
}

export type PromptOptions = ConfirmOptions & {
  inputLabel?: string
  placeholder?: string
  initialValue?: string
  required?: boolean
  multiline?: boolean
}

type ConfirmState = ConfirmOptions & {
  kind: 'confirm'
  resolve: (value: boolean) => void
}

type PromptState = PromptOptions & {
  kind: 'prompt'
  resolve: (value: string | null) => void
}

export type DialogState = ConfirmState | PromptState

type ActionDialogStore = {
  state: DialogState | null
  confirm: (options: ConfirmOptions) => Promise<boolean>
  prompt: (options: PromptOptions) => Promise<string | null>
  resolveConfirm: (value: boolean) => void
  resolvePrompt: (value: string | null) => void
  cancel: () => void
}

export const useActionDialogStore = create<ActionDialogStore>((set, get) => ({
  state: null,
  confirm: (options) =>
    new Promise<boolean>((resolve) => {
      set({ state: { kind: 'confirm', resolve, ...options } })
    }),
  prompt: (options) =>
    new Promise<string | null>((resolve) => {
      set({ state: { kind: 'prompt', resolve, ...options } })
    }),
  resolveConfirm: (value) => {
    const { state } = get()
    if (state?.kind === 'confirm') state.resolve(value)
    set({ state: null })
  },
  resolvePrompt: (value) => {
    const { state } = get()
    if (state?.kind === 'prompt') state.resolve(value)
    set({ state: null })
  },
  cancel: () => {
    const { state } = get()
    if (!state) return
    if (state.kind === 'confirm') state.resolve(false)
    else state.resolve(null)
    set({ state: null })
  },
}))

// Stable hook returning just the api callers need. Reads bound functions
// from the store so this never re-renders consumers.
export function useActionDialog() {
  return {
    confirm: useActionDialogStore.getState().confirm,
    prompt: useActionDialogStore.getState().prompt,
  }
}
