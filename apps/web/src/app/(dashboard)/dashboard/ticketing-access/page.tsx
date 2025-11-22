'use client'

import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@useticketeur/ui/components/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@useticketeur/ui/components/card'
import { Plus, Trash2 } from 'lucide-react'
import { Textarea } from '@useticketeur/ui/components/textarea'
import { Switch } from '@useticketeur/ui/components/switch'
import { PrivacyPolicyModal } from '@/components/miscellaneous/privary-policy-modal'

export default function TicketingAccessPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hello Evans Omotosho</h1>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Two</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Three</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="">
        <h1 className="text-md font-bold">Ticketing & Access</h1>

        <div className="details-section mt-8">
          {/* Ticket Types */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-md font-bold mb-2">Tier 1</h2>

              <Button variant="outline" size="sm">
                <Plus className="mr-2 size-4" />
                Add Tier 1
              </Button>
            </div>

            <div className="flex flex-col gap-4 bg-muted/50 border rounded-md p-4 ">
              <div className=" rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Ticket Name</p>
                      <Input type="text" placeholder="e.g., VIP, Early Bird" defaultValue="VIP" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Ticket Price</p>
                      <Input type="number" placeholder="0.00" defaultValue="5000" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Sales Period Start</p>
                      <Input type="datetime-local" placeholder="Select start time" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Sales Period End</p>
                      <Input type="datetime-local" placeholder="Select end time" />
                    </div>
                  </div>

                 

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Benefits</p>
                    <Textarea rows={4} className='resize-none' placeholder="What's included in this ticket?" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Access Settings */}
          <div className="mt-8 flex items-center gap-2">
            <span className='text-md font-bold text-sm'>Enable Seat Selection </span>
            <Switch  className=''/>
          </div>

          {/* preview  price summary*/}
          <div className="mt-8 gap-2">
            <span className='text-md font-bold text-sm block'>Preview price summary </span>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className='underline text-xs text-muted-foreground hover:text-foreground cursor-pointer'
            >
              Refund policy options
            </button>
          </div>

          <PrivacyPolicyModal open={isModalOpen} onOpenChange={setIsModalOpen} />

          {/* Navigation */}
          <div className="flex justify-between gap-4 items-center mt-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/venue-agenda">Previous</Link>
            </Button>
            <div className="flex items-center gap-4">
              <p className="text-xs font-medium text-muted-foreground">
                Up Next <b className="text-black">Roles</b>
              </p>
              <Button size="sm" className="text-xs font-medium text-white" asChild>
                <Link href="/dashboard/roles">Next</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

