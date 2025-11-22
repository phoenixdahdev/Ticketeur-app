'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@useticketeur/ui/components/dialog'
import { Button } from '@useticketeur/ui/components/button'

interface PrivacyPolicyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrivacyPolicyModal({ open, onOpenChange }: PrivacyPolicyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview Pricing Summary</DialogTitle>
        
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Standard Refund Policy</h3>
            <p className="text-sm text-muted-foreground">
              Full refund available up to 7 days before the event. 50% refund available up to 3 days before the event. No refunds within 3 days of the event.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

