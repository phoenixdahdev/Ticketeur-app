'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@useticketeur/ui/button'
import { CardContent } from '@useticketeur/ui/card'
import { Clock, CheckCircle2, FileText } from 'lucide-react'

export default function PendingReview() {
  const router = useRouter()

  const handleContinue = () => {
    router.push('/tour')
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <CardContent className="space-y-6 p-8">
          <div className="flex justify-center">
            <div className="bg-primary/10 rounded-full p-4">
              <Clock className="text-primary h-12 w-12" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-foreground text-2xl font-semibold">
              Documents Under Review
            </h1>
            <p className="text-muted-foreground text-sm">
              Your registration documents have been submitted and are currently
              being reviewed by our team.
            </p>
          </div>

          <div className="bg-muted/50 space-y-4 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
              <div>
                <p className="text-foreground text-sm font-medium">
                  Documents Submitted
                </p>
                <p className="text-muted-foreground text-xs">
                  Your business documents have been received
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="text-primary mt-0.5 h-5 w-5" />
              <div>
                <p className="text-foreground text-sm font-medium">
                  Review in Progress
                </p>
                <p className="text-muted-foreground text-xs">
                  Our team is verifying your information
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>What happens next?</strong>
              <br />
              You&apos;ll receive an email notification once your documents have
              been reviewed. This usually takes 1-2 business days.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
              size="lg"
            >
              Continue to Dashboard
            </Button>

            <p className="text-muted-foreground text-center text-xs">
              You can still use the platform while your verification is pending.
              Some features may be limited until verification is complete.
            </p>
          </div>
        </CardContent>
      </div>
    </div>
  )
}
