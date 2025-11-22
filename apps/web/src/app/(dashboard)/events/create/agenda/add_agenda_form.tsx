'use client'
import React from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@useticketeur/ui/form'
import { Input } from '@useticketeur/ui/input'
import { Button } from '@useticketeur/ui/button'
import { useRouter } from '@bprogress/next/app'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { addAgendaSchema, type AddAgendaType } from './schema'
import { useForm, useFieldArray } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@useticketeur/ui/popover'
import { Calendar } from '@useticketeur/ui/calendar'
import { Calendar as CalendarIcon, Plus } from 'lucide-react'
import { InlineImageInput } from '@/components/miscellaneous/inline-image-input'
import { useEventStore, type SessionDetails } from '@/hooks/use-event-store'

export function AddAgendaForm() {
  const router = useRouter()
  const { venue, sessions, setVenue, setSessions, setCurrentStep } =
    useEventStore()

  const form = useForm<AddAgendaType>({
    resolver: zodResolver(addAgendaSchema),
    defaultValues: {
      address: venue.venue_address || '',
      venue_type: venue.venue_name || '',
      sessions:
        sessions.length > 0
          ? sessions.map((s) => ({
              title: s.title || '',
              track: s.track || '',
              speaker_image: s.speaker_image || undefined,
              speaker_name: s.speaker_name || '',
              start: s.start_time || (undefined as unknown as Date),
              end: s.end_time || (undefined as unknown as Date),
            }))
          : [
              {
                title: '',
                track: '',
                speaker_image: undefined,
                speaker_name: '',
                start: undefined as unknown as Date,
                end: undefined as unknown as Date,
              },
            ],
    },
  })
  const [isPending, startTransition] = useTransition()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sessions',
  })

  const [openStart, setOpenStart] = useState<Record<number, boolean>>({})
  const [openEnd, setOpenEnd] = useState<Record<number, boolean>>({})

  function onSubmit(values: AddAgendaType) {
    startTransition(async () => {
      // Save to Zustand store
      setVenue({
        venue_name: values.venue_type,
        venue_address: values.address,
      })

      const formattedSessions: SessionDetails[] = values.sessions.map((s) => ({
        title: s.title,
        description: null,
        location: null,
        start_time: s.start,
        end_time: s.end,
        track: s.track,
        speaker_name: s.speaker_name || null,
        speaker_image: s.speaker_image || null,
      }))
      setSessions(formattedSessions)
      setCurrentStep(3)
      router.push('/events/create/tickets')
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="venue_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                  Venue Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Lagos, Nigeria"
                    {...field}
                    disabled={isPending}
                    className="border-[#ccd0de]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                  Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Lagos, Nigeria"
                    {...field}
                    disabled={isPending}
                    className="border-[#ccd0de]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between">
          <h3 className="font-transforma-sans text-xs font-bold lg:text-sm">
            Agenda Builder
          </h3>
          <Button
            variant={'outline'}
            type="button"
            onClick={() =>
              append({
                title: '',
                track: '',
                speaker_image: undefined,
                speaker_name: '',
                start: undefined as unknown as Date,
                end: undefined as unknown as Date,
              })
            }
            className="font-transforma-sans text-xs font-bold text-black lg:text-sm"
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Session
          </Button>
        </div>

        <div className="mt-5 rounded-xl border border-[#dfdfdf] bg-[#fcfcfc]">
          {fields.map((field, index) => (
            <div key={field.id} className="">
              <div className="grid gap-5 p-4 lg:grid-cols-2">
                {/* Title */}
                <FormField
                  control={form.control}
                  name={`sessions.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Session title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Track */}
                <FormField
                  control={form.control}
                  name={`sessions.${index}.track`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                        Track
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Track name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start Date */}
                <FormField
                  control={form.control}
                  name={`sessions.${index}.start`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                        Start Time
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={!!openStart[index]}
                          onOpenChange={(open) =>
                            setOpenStart((prev) => ({ ...prev, [index]: open }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between border-[#ccd0de] p-6 font-normal"
                            >
                              {field.value
                                ? (field.value as Date).toLocaleDateString()
                                : 'Select Start date'}
                              <CalendarIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="start">
                            <Calendar
                              mode="single"
                              selected={field.value as Date | undefined}
                              onSelect={(date) => {
                                field.onChange(date)
                                setOpenStart((prev) => ({
                                  ...prev,
                                  [index]: false,
                                }))
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
                  name={`sessions.${index}.end`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                        End Time
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={!!openEnd[index]}
                          onOpenChange={(open) =>
                            setOpenEnd((prev) => ({ ...prev, [index]: open }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between border-[#ccd0de] p-6 font-normal"
                            >
                              {field.value
                                ? (field.value as Date).toLocaleDateString()
                                : 'Select End Time'}
                              <CalendarIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="start">
                            <Calendar
                              mode="single"
                              selected={field.value as Date | undefined}
                              onSelect={(date) => {
                                field.onChange(date)
                                setOpenEnd((prev) => ({
                                  ...prev,
                                  [index]: false,
                                }))
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`sessions.${index}.speaker_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                        Speaker Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Speaker Name"
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`sessions.${index}.speaker_image`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                        Speaker Image
                      </FormLabel>
                      <FormControl>
                        <InlineImageInput
                          value={field.value ?? null}
                          onChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {index > 0 && (
                <div className="flex items-end justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                    className="text-destructive auto border-0 bg-transparent shadow-none hover:bg-transparent"
                  >
                    <Trash2 className="h-3 w-3" /> Remove Session
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-end gap-5">
          <p className="font-transforma-sans text-xs font-medium">
            Up Next <span className="font-bold">Ticketing & Access</span>
          </p>
          <Button
            type="submit"
            className="h-12 w-auto rounded-xl lg:px-20"
            disabled={isPending}
          >
            {isPending ? 'Creating...' : 'Next'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
