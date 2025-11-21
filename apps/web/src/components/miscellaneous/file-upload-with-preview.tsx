/* eslint-disable @next/next/no-img-element */
'use client'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText } from 'lucide-react'
import { cn } from '@useticketeur/ui/lib/utils'

interface FileUploadWithPreviewProps {
  label: string
  onFileSelect: (file: File | null) => void
  selectedFile?: File | null
  preview?: string | null
  accept?: Record<string, string[]>
}

export function FileUploadWithPreview({
  label,
  onFileSelect,
  selectedFile,
  preview,
  accept = {
    'image/png': ['.png'],
    'image/svg+xml': ['.svg'],
    'application/pdf': ['.pdf'],
  },
}: FileUploadWithPreviewProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop: (files) => onFileSelect(files[0] || null),
    multiple: false,
  })

  return (
    <div className="space-y-3">
      <label className="text-foreground text-sm font-medium">{label}</label>

      {selectedFile && preview && (
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
      )}

      {/* Upload area */}
      <div
        {...getRootProps()}
        className={cn(
          'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-accent/50',
          selectedFile && 'opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
        <p className="text-muted-foreground text-sm">
          {selectedFile ? `${selectedFile.name} selected` : 'PNG, SVG, or PDF'}
        </p>
      </div>
    </div>
  )
}
