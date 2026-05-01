import { Button } from '@ticketur/ui/components/button'

export function ProfileActions() {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        className="border-amber-400 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
      >
        Suspend
      </Button>
      <Button
        type="button"
        variant="outline"
        className="border-rose-400 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
      >
        Disable
      </Button>
    </div>
  )
}
