/* eslint-disable @next/next/no-img-element */
'use client'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button } from '../ui/button'
import Image from 'next/image'

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
          'flex min-h-85 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-accent/50',
          selectedFile && 'opacity-50'
        )}
      >
        <div>
          <input {...getInputProps()} />
          <Image
            src="/upload.svg"
            width={100}
            height={100}
            alt="upload"
            className=" w-10 h-10 lg:w-18 lg:h-18 mx-auto"
          />

          <h3 className="font-trap text-lg font-bold lg:text-xl mt-2">
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
    </div>
  )
}
