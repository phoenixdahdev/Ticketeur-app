import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@useticketeur/ui/components/card'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your event performance and insights.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Views</CardTitle>
            <CardDescription>Total views across all events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground text-xs mt-1">
              No data available yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Ticket sales conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-muted-foreground text-xs mt-1">
              No data available yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Event</CardTitle>
            <CardDescription>Your best event by sales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No events to analyze yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Ticket Price</CardTitle>
            <CardDescription>Mean price across all tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦0</div>
            <p className="text-muted-foreground text-xs mt-1">
              No data available yet
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Over Time</CardTitle>
          <CardDescription>Ticket sales trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Chart will be displayed here once you have event data
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

