'use client'

import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { Plus } from 'lucide-react'

export default function Page() {
  return (
    <div className="mt-5 flex flex-col items-start justify-center gap-6 lg:mt-10">
      <h1 className="font-trap text-2xl font-bold lg:text-3xl">Events</h1>
      <p className="text-muted-foreground">
        Manage your events here create, edit, and view all scheduled events.
      </p>

      <Button asChild className="font-semibold">
        <Link href="/events/create">
          <Plus className="h-3 w-3" />
          Create Event
        </Link>
      </Button>
    </div>
  )
}
