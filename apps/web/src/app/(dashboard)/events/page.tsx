import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@useticketeur/ui/card'
import { Button } from '@useticketeur/ui/button'
import { Plus } from 'lucide-react'

export default function MyEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize all your events in one place.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Create Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for events - will be populated with real data later */}
        <Card>
          <CardHeader>
            <CardTitle>No Events Yet</CardTitle>
            <CardDescription>
              Get started by creating your first event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Create Your First Event
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
