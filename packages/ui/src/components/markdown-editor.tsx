'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useCurrentEditor } from '@tiptap/react'

import {
  EditorBubbleMenu,
  EditorClearFormatting,
  EditorFormatBold,
  EditorFormatCode,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorFormatUnderline,
  EditorNodeBulletList,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeOrderedList,
  EditorNodeQuote,
  EditorProvider,
} from './kibo-ui/editor'
import { cn } from '../lib/utils'

type MarkdownEditorProps = {
  value: string
  onChange: (markdown: string) => void
  placeholder?: string
  className?: string
  contentClassName?: string
  ariaInvalid?: boolean
  ariaLabel?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write something…',
  className,
  contentClassName,
  ariaInvalid,
  ariaLabel,
}: MarkdownEditorProps) {
  return (
    <EditorProvider
      content={value}
      placeholder={placeholder}
      className={cn(
        'border-input data-[invalid=true]:border-destructive bg-background focus-within:border-primary/60 focus-within:ring-primary/20 flex min-h-40 flex-col rounded-md border focus-within:ring-2',
        className
      )}
      editorProps={{
        attributes: {
          class: cn(
            'prose prose-sm dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-headings:font-bold prose-headings:tracking-tight min-h-32 max-w-none px-4 py-3 outline-none focus:outline-none [&_.ProseMirror]:outline-none',
            contentClassName
          ),
          'aria-invalid': ariaInvalid ? 'true' : 'false',
          ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
          'data-invalid': ariaInvalid ? 'true' : 'false',
        },
      }}
      slotBefore={<MarkdownEditorToolbar />}
    >
      <MarkdownEditorBridge value={value} onChange={onChange} />
      <EditorBubbleMenu className="bg-background flex items-center gap-0.5 rounded-md border p-1 shadow-md">
        <EditorFormatBold hideName />
        <EditorFormatItalic hideName />
        <EditorFormatUnderline hideName />
        <EditorFormatStrike hideName />
        <EditorFormatCode hideName />
      </EditorBubbleMenu>
    </EditorProvider>
  )
}

function MarkdownEditorToolbar() {
  return (
    <div className="border-input flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
      <EditorNodeHeading1 hideName />
      <EditorNodeHeading2 hideName />
      <span className="bg-border mx-1 h-5 w-px" aria-hidden />
      <EditorFormatBold hideName />
      <EditorFormatItalic hideName />
      <EditorFormatUnderline hideName />
      <EditorFormatStrike hideName />
      <EditorFormatCode hideName />
      <span className="bg-border mx-1 h-5 w-px" aria-hidden />
      <EditorNodeBulletList hideName />
      <EditorNodeOrderedList hideName />
      <EditorNodeQuote hideName />
      <span className="bg-border mx-1 h-5 w-px" aria-hidden />
      <EditorClearFormatting hideName />
    </div>
  )
}

// Bridges editor content updates back to RHF/state without rerendering tiptap.
function MarkdownEditorBridge({
  value,
  onChange,
}: {
  value: string
  onChange: (markdown: string) => void
}) {
  const { editor } = useCurrentEditor()
  const lastEmitted = useRef<string>(value)

  const emit = useCallback(() => {
    if (!editor) return
    const md =
      (
        editor.storage as { markdown?: { getMarkdown: () => string } }
      ).markdown?.getMarkdown() ?? editor.getHTML()
    if (md !== lastEmitted.current) {
      lastEmitted.current = md
      onChange(md)
    }
  }, [editor, onChange])

  useEffect(() => {
    if (!editor) return
    editor.on('update', emit)
    editor.on('blur', emit)
    return () => {
      editor.off('update', emit)
      editor.off('blur', emit)
    }
  }, [editor, emit])

  // Sync external resets (e.g. form.reset) back into the editor without
  // looping — only when the incoming value differs from what we last emitted.
  useEffect(() => {
    if (!editor) return
    if (value !== lastEmitted.current) {
      lastEmitted.current = value
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [editor, value])

  return null
}
