'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Upload } from 'lucide-react'
import { useRouter } from '@bprogress/next/app'

interface FileUploadProps {
  label: string
  onFileSelect: (files: File[]) => void
  acceptedFiles?: File[]
}

function FileUpload({
  label,
  onFileSelect,
  acceptedFiles = [],
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/svg+xml': ['.svg'],
      'application/pdf': ['.pdf'],
    },
    onDrop: onFileSelect,
    multiple: false,
  })

  return (
    <div className="space-y-2">
      <label className="text-foreground text-sm font-medium">{label}</label>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/50'} `}
      >
        <input {...getInputProps()} />
        <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
        <p className="text-muted-foreground text-sm">
          {acceptedFiles.length > 0
            ? `${acceptedFiles[0].name} selected`
            : 'PNG,SVG,PDF'}
        </p>
      </div>
    </div>
  )
}

export default function BusinessVerification() {
  const router = useRouter()
  const [businessDoc, setBusinessDoc] = useState<File[]>([])
  const [validId, setValidId] = useState<File[]>([])

  const handleSubmit = () => {
    console.log('Submitting for review...', { businessDoc, validId })
    router.push('/')
    console.log('Skipping verification...')
  }

  const handleSkip = () => {
    router.push('/')
    console.log('Skipping verification...')
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-foreground text-2xl font-semibold">
              Verify your business
            </h1>
            <p className="text-muted-foreground text-sm">
              Verified organizers can access faster payouts and unlock more
              features.
            </p>
          </div>

          <div className="space-y-6">
            <FileUpload
              label="Upload your business registration document"
              onFileSelect={setBusinessDoc}
              acceptedFiles={businessDoc}
            />

            <FileUpload
              label="Upload a valid ID"
              onFileSelect={setValidId}
              acceptedFiles={validId}
            />
          </div>

          <p className="text-muted-foreground text-xs">
            Verification usually takes 1-2 business days. You can skip for now
            and verify later.
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
              size="lg"
            >
              Submit for Review
            </Button>

            <button
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground w-full cursor-pointer text-sm transition-colors"
            >
              Skip for now
            </button>
          </div>
        </CardContent>
      </div>
    </div>
  )
}
