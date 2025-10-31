'use client'
import { ChevronDown } from 'lucide-react'
import { Button } from 'ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/dropdown-menu'

export default function FilterDropdowns() {
  const filters = ['Option', 'Month', 'Industry']

  return (
    <div className="flex flex-wrap gap-2 md:flex-nowrap md:gap-3">
      {filters.map((filter) => (
        <DropdownMenu key={filter}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-card border-border hover:bg-card/80 text-foreground gap-2 text-sm md:text-base"
            >
              {filter}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Option 1</DropdownMenuItem>
            <DropdownMenuItem>Option 2</DropdownMenuItem>
            <DropdownMenuItem>Option 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  )
}
