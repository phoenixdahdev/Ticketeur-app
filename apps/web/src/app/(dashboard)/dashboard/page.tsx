'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@useticketeur/ui/components/breadcrumb'
import { Button } from '@useticketeur/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@useticketeur/ui/components/card'
import {  ChevronRight, CloudUpload, Plus, Upload, X } from 'lucide-react'
import { Input } from '@useticketeur/ui/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@useticketeur/ui/components/select'
import { Textarea } from '@useticketeur/ui/components/textarea'
import { DatePicker } from '@useticketeur/ui/components/date-picker'

export default function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; name: string; id: string }>>([])

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
      }))
      setUploadedImages((prev) => [...prev, ...newImages])
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (id: string) => {
    setUploadedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      return prev.filter((img) => img.id !== id)
    })
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hello Evans Omotosho</h1>
      </div>

       <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className='text-md font-medium flex items-center gap-2'>One <ChevronRight className='size-4 text-muted-foreground ' /></BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="">

        {/* title */}
        <h1 className='text-2xl font-bold'>Basic Details</h1>
        <p className='text-sm font-medium mb-4 mt-4'> Event Image / Banner </p>

        {/* upload image section */}
        <div className='h-fit flex flex-col items-center justify-center border py-15 rounded-md border-2 border-dashed border-muted-foreground'>
          <div className='flex flex-col items-center justify-center'>

          <div className='flex items-center justify-center rounded-full bg-muted h-14 w-14 mb-4'>
            <CloudUpload className='size-6 text-muted-foreground' />
          </div>

          <h3 className='text-xs md:text-lg font-medium w-full mt-2 mb-2 text-center max-w-xs'> Drag to upload </h3>

            <div className='flex flex-col items-center  text-xs text-muted-foreground text-center'>
              <span>200mb maximum</span>
              <span>jpg, png, Supported</span>
            </div>
          </div>

          <Button 
            size="sm" 
            className='bg-black mt-5' 
            type="button"
            onClick={handleFileSelect}
          >
            Browse to upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {/* uploaded images here */}
        {uploadedImages.length > 0 && (
          <div className='flex flex-col gap-4 mt-4'>
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-medium mb-2'> Uploaded Images </p>
              <div className='flex flex-col gap-2'>
                {uploadedImages.map((image) => (
                  <div key={image.id} className='flex items-center gap-3 p-3 border rounded-md bg-muted/50'>
                    <div className='relative w-10 h-10 rounded-md overflow-hidden border flex-shrink-0'>
                      <img
                        src={image.url}
                        alt={image.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <span className='text-sm font-medium flex-1 truncate'>{image.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className='h-8 w-8 flex-shrink-0'
                      onClick={() => handleRemoveImage(image.id)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Event title */}
        <div className="details-section mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-medium mb-4 mt-4'> Event Title </p>
              <Input type="text" placeholder='Enter event title' />
            </div>

            <div className='flex flex-col gap-2'>
              <p className='text-sm font-medium mb-4 mt-4'> Event Type </p>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Select event type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event description */}
          <div>
            <p className='text-sm font-medium mb-4 mt-4'> Event Description </p>
            <Textarea placeholder='Enter event description' rows={4} className='resize-none' />
          </div>

          {/* Date pickers */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-medium mb-4 mt-4'> Event Start Date </p>
              <DatePicker />
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-medium mb-4 mt-4'> Event End Date </p>
              <Input type="date" />
            </div>
          </div>


          {/* next */}
          <div className='flex justify-end gap-4 items-center'>
            <p className='text-xs font-medium mb-4 mt-4 text-muted-foreground'> Up Next <b className='text-black'>Venue & Agenda </b> </p>
            <Button size="sm" className='text-xs font-medium mb-4 mt-4 text-white' asChild>
              <Link href="/dashboard/venue-agenda">Next</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
