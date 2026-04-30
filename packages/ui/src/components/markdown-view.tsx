'use client'

import { Streamdown, type StreamdownProps } from 'streamdown'

import { cn } from '../lib/utils'

export type MarkdownViewProps = StreamdownProps & {
  className?: string
}

export function MarkdownView({ className, ...props }: MarkdownViewProps) {
  return (
    <Streamdown
      className={cn(
        'prose prose-sm md:prose-base dark:prose-invert max-w-none',
        'prose-headings:font-bold prose-headings:tracking-tight',
        'prose-p:leading-7 prose-p:my-3',
        'prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:underline',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-medium prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:rounded-xl prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4',
        'prose-blockquote:border-l-primary prose-blockquote:not-italic prose-blockquote:font-normal',
        'prose-ul:my-3 prose-ol:my-3 prose-li:my-0',
        className
      )}
      {...props}
    />
  )
}
