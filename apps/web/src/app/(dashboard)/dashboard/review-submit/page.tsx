'use client'

import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@useticketeur/ui/components/breadcrumb'
import { Button } from '@useticketeur/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@useticketeur/ui/components/card'
import { CheckCircle2, Edit } from 'lucide-react'

export default function ReviewSubmitPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hello Evans Omotosho</h1>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Review & Submit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="">
        <h1 className="text-2xl font-bold">Overview</h1>

        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent>
           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-2'>
              <p className="text-sm font-medium">Event Image</p>
              <p className="text-sm font-medium">Image 1</p>
            </div>
            <div className='flex flex-col gap-2'>
              <p className="text-sm font-medium">Event Description</p>
              <div 
                className="w-[100px] h-[100px] rounded-lg"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #f5f5f5 25%, transparent 25%),
                    linear-gradient(-45deg, #f5f5f5 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #f5f5f5 75%),
                    linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)
                  `,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>  
            </div>
          </CardContent>
        </Card>
          {/* Venue & Agenda Review */}
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Venue & Agenda</CardTitle>
                  <CardDescription>Location and schedule information</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/venue-agenda">
                    <Edit className="mr-2 size-4" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Venue:</span>
                <span className="text-sm font-medium">Sample Venue Name</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Address:</span>
                <span className="text-sm font-medium">123 Main St, City, State</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sessions:</span>
                <span className="text-sm font-medium">3 sessions scheduled</span>
              </div>
            </CardContent>
          </Card>

          {/* Ticketing Review */}
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ticketing & Access</CardTitle>
                  <CardDescription>Ticket types and pricing</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/ticketing-access">
                    <Edit className="mr-2 size-4" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ticket Types:</span>
                <span className="text-sm font-medium">3 types (VIP, Regular, Early Bird)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Capacity:</span>
                <span className="text-sm font-medium">500 tickets</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Visibility:</span>
                <span className="text-sm font-medium">Public</span>
              </div>
            </CardContent>
          </Card>

          {/* Roles Review */}
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Team members and their roles</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/roles">
                    <Edit className="mr-2 size-4" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Team Members:</span>
                <span className="text-sm font-medium">2 members assigned</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Organizers:</span>
                <span className="text-sm font-medium">1 organizer</span>
              </div>
            </CardContent>
          </Card>

          {/* Submission Notice */}
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <CheckCircle2 className="size-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Ready to Submit</p>
                  <p className="text-xs text-muted-foreground">
                    Your event will be submitted for admin approval. You'll be notified once it's reviewed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between gap-4 items-center mt-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/roles">Previous</Link>
            </Button>
            <div className="flex items-center gap-4">
              <Button size="sm" className="text-xs font-medium text-white">
                Submit for Approval
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

