import * as React from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@useticketeur/ui/lib/utils'

export interface DatePickerProps
  extends React.ComponentProps<'input'> {}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, type = 'date', ...props }, ref) => {
    return (
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm shadow-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
DatePicker.displayName = 'DatePicker'

export { DatePicker }

