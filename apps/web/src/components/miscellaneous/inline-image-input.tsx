'use client'
import React from 'react'

import { X, FileText, CloudUpload } from 'lucide-react'
import { Button } from '@useticketeur/ui/button'
import { cn } from '@useticketeur/ui/lib/utils'

interface InlineImageInputProps {
  value?: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
  accept?: Record<string, string[]>
}

export function InlineImageInput({
  value,
  onChange,
  disabled,
  accept = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/svg+xml': ['.svg'],
  },
}: InlineImageInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="file"
        accept={Object.values(accept).flat().join(',')}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
        id="inline-image-input"
      />
      {value ? (
        <div className="flex max-h-12 items-center gap-2 rounded-md border border-gray-300 p-2">
          {value.endsWith('.pdf') ? (
            <FileText className="h-6 w-6 text-gray-500" />
          ) : (
            <img src={value} alt="Preview" className="h-5 w-5 object-contain" />
          )}
          <span className="text-sm">{value.split('/').pop()}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange(null)}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor="inline-image-input"
          className={cn(
            'flex w-full cursor-pointer items-center justify-between rounded-md border border-[#ccd0de] p-3 text-sm text-black hover:border-gray-400',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          File Upload <CloudUpload className="h-5 w-5" />
        </label>
      )}
    </div>
  )
}
