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

export default function RolesPage() {
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
              <Link href="/dashboard">Three</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Four</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="">
        <div className="details-section mt-8">
          {/* Roles */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-md font-bold mb-2">Role 1</h2>

              <Button variant="outline" size="sm">
                <Plus className="mr-2 size-4" />
                Add Role 1
              </Button>
            </div>

            <div className="flex flex-col gap-4 bg-muted/50 border rounded-md p-4 ">
              <div className=" rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Team Member Name</p>
                      <Input type="text" placeholder="Enter name" defaultValue="Evans Omotosho" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Email Address</p>
                      <Input type="email" placeholder="Enter email" defaultValue="evans@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Role</p>
                      <Select defaultValue="organizer">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="organizer">Organizer - Full access</SelectItem>
                          <SelectItem value="coordinator">Coordinator - Manage attendees</SelectItem>
                          <SelectItem value="staff">Staff - Check-in and support</SelectItem>
                          <SelectItem value="volunteer">Volunteer - Limited access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Permissions</p>
                      <Select defaultValue="organizer">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="organizer">Organizer - Full access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>


                <div className="mt-8 flex items-center gap-2">
                  <span className='text-md font-bold text-sm'>Enable White Label Mode </span>
                  <Switch />
                </div>

                <div className='bg-muted border border-dashed rounded-md p-4 text-sm text-muted-foreground py-4 mt-4 w-full md:w-[70%]'>
                  <p className='text-sm text-muted-foreground'>Join us at TechWave Summit 2024, the premier gathering for technology enthusiasts, innovators, industry leaders, and visionaries. Over three exciting days, discover the cutting-edge advancements shaping tomorrow's world in AI, cybersecurity, blockchain, cloud computing, and more.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4 items-center mt-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/ticketing-access">Previous</Link>
            </Button>
            <div className="flex items-center gap-4">
              <p className="text-xs font-medium text-muted-foreground">
                Up Next <b className="text-black">Review & Submit</b>
              </p>
              <Button size="sm" className="text-xs font-medium text-white" asChild>
                <Link href="/dashboard/review-submit">Next</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}
