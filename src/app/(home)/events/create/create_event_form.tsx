'use client'
import React from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'ui/form'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import { useRouter } from '@bprogress/next/app'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { createEventSchema, type CreateEventType } from '../schema'
import { useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from 'ui/select'
import { eventTypes } from '~/db/schema/event'
import { Textarea } from 'ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover'
import { Calendar } from 'ui/calendar'
import { ChevronDownIcon } from 'lucide-react'
import { useFilePreview } from '~/hook/use-file-preview'
import { ImageUpload } from '~/components/miscellaneous/image-upload'
export function CreateEventForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const form = useForm<CreateEventType>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      event_type: '',
      event_start_date: undefined as unknown as Date,
      event_end_date: undefined as unknown as Date,
    },
  })
  const [isPending, startTransition] = useTransition()
  const [openStartDate, setOpenStartDate] = React.useState(false)
  const [openEndDate, setOpenEndDate] = React.useState(false)
  const { filePreview, handleFileSelect } = useFilePreview()

  function onSubmit(values: CreateEventType) {
    startTransition(async () => {
      // call request here
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="mt-5">
              <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                Event Image / Banner
              </FormLabel>
              <FormControl>
                <ImageUpload
                  onFileSelect={(file) => {
                    field.onChange(file) // update RHF form value
                    handleFileSelect(file) // optional, for preview
                  }}
                  selectedFile={filePreview.file}
                  preview={filePreview.preview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                  Event Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Devfest 2025"
                    {...field}
                    disabled={isPending}
                    className="border-[#ccd0de]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* category */}
          <FormField
            control={form.control}
            name="event_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                  Event Type
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-full border-[#ccd0de] py-6">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Types</SelectLabel>
                        {eventTypes?.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mt-5">
              <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                Event Title
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="We want to network with others"
                  {...field}
                  disabled={isPending}
                  className="border-[#ccd0de] lg:min-h-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Start Date */}
          <FormField
            control={form.control}
            name="event_start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                  Event Start Date
                </FormLabel>
                <FormControl>
                  <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between border-[#ccd0de] p-6 font-normal"
                      >
                        {field.value
                          ? (field.value as Date).toLocaleDateString()
                          : 'Select Start date'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value as Date | undefined}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          field.onChange(date) // update RHF form value
                          setOpenStartDate(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={form.control}
            name="event_end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                  Event End Date
                </FormLabel>
                <FormControl>
                  <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between border-[#ccd0de] p-6 font-normal"
                      >
                        {field.value
                          ? (field.value as Date).toLocaleDateString()
                          : 'Select End date'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value as Date | undefined}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          field.onChange(date)
                          setOpenEndDate(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-5 flex items-center justify-end gap-5">
          <p className='text-xs font-medium font-transforma-sans'>
            Up Next <span className='font-bold'>Venue & Agenda</span>
          </p>
          <Button
            type="submit"
            className="h-12 w-auto rounded-xl lg:px-20"
            disabled={isPending}
          >
            {isPending ? 'Creating Event...' : 'Next'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
