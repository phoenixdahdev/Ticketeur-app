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
import { Input } from '@useticketeur/ui/components/input'
import { Textarea } from '@useticketeur/ui/components/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@useticketeur/ui/components/select'
import { Plus } from 'lucide-react'

export default function VenueAgendaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hello Evans Omotosho</h1>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">One</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Two</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="">
        {/* Venue Details */}
        <div className="details-section mt-8">
          <div className="flex flex-col gap-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium mb-2">Venue Name</p>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="convention-center">Convention Center</SelectItem>
                    <SelectItem value="hotel-ballroom">Hotel Ballroom</SelectItem>
                    <SelectItem value="conference-hall">Conference Hall</SelectItem>
                    <SelectItem value="stadium">Stadium</SelectItem>
                    <SelectItem value="outdoor-venue">Outdoor Venue</SelectItem>
                    <SelectItem value="theater">Theater</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium mb-2">Venue Address</p>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue address" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="address-1">123 Main Street, Downtown</SelectItem>
                    <SelectItem value="address-2">456 Business District, City Center</SelectItem>
                    <SelectItem value="address-3">789 Event Plaza, West End</SelectItem>
                    <SelectItem value="address-4">321 Convention Way, East Side</SelectItem>
                    <SelectItem value="custom">Enter custom address</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Agenda Section */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-ms text-muted-foreground font-bold mb-4">Event Agenda</h2>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 size-4" /> 
                Add Session
              </Button>
            </div>
            
            <div className="flex flex-col gap-4 bg-muted/50 border rounded-md p-4 ">
              <div className=" rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Title</p>
                    <Input type="text" placeholder="Enter session title" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Track</p>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select track" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="track-1">Track 1</SelectItem>
                        <SelectItem value="track-2">Track 2</SelectItem>
                        <SelectItem value="track-3">Track 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

        {/* Session Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Start Time</p>
                    <Input type="time"  placeholder='Select start time'/>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">End Time</p>
                    <Input type="time"  placeholder='Select end time'/>
                  </div>
                </div>

                {/* Speaker */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Speaker</p>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select speaker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="speaker-1">Speaker 1</SelectItem>
                        <SelectItem value="speaker-2">Speaker 2</SelectItem>
                        <SelectItem value="speaker-3">Speaker 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Speaker Image</p>
                    <Input type="file"  placeholder='File Upload'/>
                  </div>
                </div>
                </div>
              </div>
            </div>

          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4 items-center mt-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">Previous</Link>
            </Button>
            <div className="flex items-center gap-4">
              <p className="text-xs font-medium text-muted-foreground">
                Up Next <b className="text-black">Ticketing & Access</b>
              </p>
              <Button size="sm" className="text-xs font-medium text-white" asChild>
                <Link href="/dashboard/ticketing-access">Next</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

