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
import { createTicketSchema, type CreateTicketType } from './schema'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@useticketeur/ui/popover'
import { Calendar } from '@useticketeur/ui/calendar'
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react'
import { Switch } from '@useticketeur/ui/switch'
export function CreateTicketForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const form = useForm<CreateTicketType>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      tickets: [
        {
          name: '',
          description: null,
          image: null,
          price: 0,
          currency: 'NGN',
          start: undefined as unknown as Date,
          end: undefined as unknown as Date,
          enable_sit_selection: false,
          benefits: [],
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tickets',
  })

  const [isPending, startTransition] = useTransition()
  const [openStart, setOpenStart] = useState<Record<number, boolean>>({})
  const [openEnd, setOpenEnd] = useState<Record<number, boolean>>({})

  function onSubmit(values: CreateTicketType) {
    startTransition(async () => {
      // call request here
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-7 flex flex-wrap items-center justify-between">
          <h3 className="font-transforma-sans text-xs font-bold lg:text-sm">
            Tier 1
          </h3>
          <Button
            variant={'outline'}
            type="button"
            onClick={() =>
              append({
                name: '',
                description: null,
                image: null,
                price: 0,
                currency: 'NGN',
                start: undefined as unknown as Date,
                end: undefined as unknown as Date,
                enable_sit_selection: false,
                benefits: [],
              })
            }
            className="font-transforma-sans text-xs font-bold text-black lg:text-sm"
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Session
          </Button>
        </div>
        <div className="mt-5 rounded-xl border border-[#dfdfdf] bg-[#fcfcfc]">
          {fields.map((field, index) => {
            const benefits = form.watch(`tickets.${index}.benefits`) || []
            if (benefits.length === 0) {
              form.setValue(`tickets.${index}.benefits`, [''])
            }
            return (
              <div key={field.id} className="">
                <div className="grid gap-5 p-4 lg:grid-cols-2">
                  {/* Ticket Name */}
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                          Ticket Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Premium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price */}
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                          Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Track name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Start Date */}
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.start`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                          Start Sales Period
                        </FormLabel>
                        <FormControl>
                          <Popover
                            open={!!openStart[index]}
                            onOpenChange={(open) =>
                              setOpenStart((prev) => ({
                                ...prev,
                                [index]: open,
                              }))
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
                    name={`tickets.${index}.end`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                          End Sales Period
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

                  {/* Benefits */}
                  <div className="lg:col-span-2">
                    <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                      Benefits
                    </FormLabel>

                    {benefits.map((benefit, bIndex) => (
                      <div
                        key={bIndex}
                        className="mt-2 flex items-center gap-2"
                      >
                        <Input
                          {...form.register(
                            `tickets.${index}.benefits.${bIndex}` as const
                          )}
                          placeholder="Enter benefit"
                        />
                        {benefits.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const updated = [...benefits]
                              updated.splice(bIndex, 1)
                              form.setValue(
                                `tickets.${index}.benefits`,
                                updated
                              )
                            }}
                          >
                            <Trash2 />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant={'outline'}
                      onClick={() =>
                        form.setValue(`tickets.${index}.benefits`, [
                          ...benefits,
                          '',
                        ])
                      }
                      className="font-transforma-sans mt-2 text-xs font-bold text-black lg:text-sm"
                    >
                      <Plus className="h-3 w-3" /> Add Benefit
                    </Button>
                  </div>

                  {/* Enable seat selection  */}
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.enable_sit_selection`}
                    render={({ field }) => (
                      <FormItem className="flex lg:gap-7">
                        <FormLabel className="font-transforma-sans mb-0 text-xs font-bold lg:text-sm">
                          Enable Seat Selection
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
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
                      <Trash2 className="h-3 w-3" /> Remove Ticket
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-5 flex items-center justify-end gap-5">
          <p className="font-transforma-sans text-xs font-medium">
            Up Next <span className="font-bold">Roles</span>
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
