'use client'

import { useState, useTransition } from 'react'
import { Button } from '~/components/ui/button'
import { CardContent } from '~/components/ui/card'
import { useRouter } from 'next/navigation'
import { useFilePreview } from '~/hook/use-file-preview'
import { uploadBusinessDocument } from '~/lib/upload'
import { FileUploadWithPreview } from '~/components/miscellaneous/file-upload-with-preview'
import { send_onboarding_response } from '../actions'
import { toast } from 'sonner'

export default function BusinessVerification() {
  const router = useRouter()
  const [isLoading, startTransition] = useTransition()
  const {
    filePreview: businessDocPreview,
    handleFileSelect: handleBusinessDocSelect,
  } = useFilePreview()
  const { filePreview: validIdPreview, handleFileSelect: handleValidIdSelect } =
    useFilePreview()

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    startTransition(async () => {
      setError(null)

      if (!businessDocPreview.file || !validIdPreview.file) {
        setError('Please upload both documents')
        return
      }
      const businessId = `business-${Date.now()}`
      try {
        const [businessDocResult, validIdResult] = await Promise.all([
          uploadBusinessDocument(
            businessDocPreview.file,
            businessId,
            'business-doc'
          ),
          uploadBusinessDocument(validIdPreview.file, businessId, 'valid-id'),
        ])

        if (!businessDocResult.success || !validIdResult.success) {
          setError(
            businessDocResult.error || validIdResult.error || 'Upload failed'
          )
          return
        }
        const documents = [businessDocResult.url, validIdResult.url].filter((url): url is string => !!url)
        const result = await send_onboarding_response({ documents })

        if (!result.success) {
          setError(result.error || 'Failed to submit onboarding')
          return
        }

        toast.success('Documents submitted successfully! Admin will review your submission.')
        router.push('/tour')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    })
  }

  const handleSkip = () => {
    router.push('/tour')
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
            <FileUploadWithPreview
              label="Upload your business registration document"
              onFileSelect={handleBusinessDocSelect}
              selectedFile={businessDocPreview.file}
              preview={businessDocPreview.preview}
            />

            <FileUploadWithPreview
              label="Upload a valid ID"
              onFileSelect={handleValidIdSelect}
              selectedFile={validIdPreview.file}
              preview={validIdPreview.preview}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <p className="text-muted-foreground text-xs">
            Verification usually takes 1-2 business days. You can skip for now
            and verify later.
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={
                isLoading || !businessDocPreview.file || !validIdPreview.file
              }
              className="w-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              size="lg"
            >
              {isLoading ? 'Uploading...' : 'Submit for Review'}
            </Button>

            <button
              onClick={handleSkip}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground w-full cursor-pointer text-sm transition-colors disabled:opacity-50"
            >
              Skip for now
            </button>
          </div>
        </CardContent>
      </div>
    </div>
  )
}
