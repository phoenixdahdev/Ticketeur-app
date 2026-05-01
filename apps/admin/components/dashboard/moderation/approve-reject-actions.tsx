import { Button } from '@ticketur/ui/components/button'

export function ApproveRejectActions() {
  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
      <Button
        type="button"
        size="lg"
        className="bg-emerald-500 text-white hover:bg-emerald-600"
      >
        Approve
      </Button>
      <Button
        type="button"
        size="lg"
        variant="outline"
        className="border-rose-400 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
      >
        Reject
      </Button>
    </div>
  )
}
