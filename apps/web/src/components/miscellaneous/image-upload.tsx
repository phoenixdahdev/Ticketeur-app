/* eslint-disable @next/next/no-img-element */
'use client'
import { useDropzone } from 'react-dropzone'
import { X, FileText, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@useticketeur/ui/lib/utils'
import { Button } from '@useticketeur/ui/button'

interface FileUploadWithPreviewProps {
  onFileSelect: (file: File | null) => void
  selectedFile?: File | null
  preview?: string | null
  accept?: Record<string, string[]>
}

export function ImageUpload({
  onFileSelect,
  selectedFile,
  preview,
  accept = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/svg+xml': ['.svg'],
  },
}: FileUploadWithPreviewProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop: (files) => onFileSelect(files[0] || null),
    multiple: false,
  })

  return (
    <div className="space-y-3">
      {selectedFile && preview ? (
        <div className="border-border bg-accent/30 relative rounded-lg border p-4">
          {preview === 'pdf' ? (
            <div className="flex items-center gap-3">
              <FileText className="text-muted-foreground h-12 w-12" />
              <div className="flex-1">
                <p className="text-foreground text-sm font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ) : (
            <img
              src={preview || '/placeholder.svg'}
              alt="Preview"
              className="max-h-48 w-full rounded object-contain"
            />
          )}
          <button
            onClick={() => onFileSelect(null)}
            className="bg-background hover:bg-accent absolute top-2 right-2 rounded-full p-1"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'flex min-h-85 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-accent/50',
            selectedFile && 'opacity-50'
          )}
        >
          <div>
            <input {...getInputProps()} />
            <div className={cn('rounded-full text-[#A7ACC1]')}>
              <UploadCloud className="mx-auto h-10 w-10" />
            </div>

            <h3 className="font-trap mt-2 text-lg font-bold lg:text-xl">
              Drag to upload
            </h3>
            <p className="font-transforma-sans mt-2 text-xs text-[#4d5168] lg:mt-4">
              200mb maximum
            </p>
            <p className="font-transforma-sans text-xs text-[#4d5168]">
              jpeg, png, supported
            </p>

            <Button className="font-transforma-sans mt-2 bg-black p-5 font-bold lg:mt-4">
              {selectedFile
                ? `${selectedFile.name} selected`
                : 'Browse to upload'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
