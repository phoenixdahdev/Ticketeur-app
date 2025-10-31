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
import { createRoleSchema, type CreateRoleType } from './schema'
import { useForm, useFieldArray } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover'
import { Calendar } from 'ui/calendar'
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react'
import { Switch } from 'ui/switch'
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

export function CreateRoleForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const form = useForm<CreateRoleType>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      roles: [
        {
          name: '',
          email: '',
          role: '',
          permission: '',
          white_label: false,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'roles',
  })

  const [isPending, startTransition] = useTransition()

  function onSubmit(values: CreateRoleType) {
    startTransition(async () => {
      // call request here
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-7 flex flex-wrap items-center justify-between">
          <h3 className="font-transforma-sans text-xs font-bold lg:text-sm">
            Team Member 1
          </h3>
          <Button
            variant={'outline'}
            type="button"
            onClick={() =>
              append({
                name: '',
                email: '',
                role: '',
                permission: '',
                white_label: false,
              })
            }
            className="font-transforma-sans text-xs font-bold text-black lg:text-sm"
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Team Member roles
          </Button>
        </div>

        <div className="mt-5 rounded-xl border border-[#dfdfdf] bg-[#fcfcfc]">
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="">
                <div className="grid gap-5 p-4 pb-0 lg:grid-cols-2">
                  {/* Ticket Name */}
                  <FormField
                    control={form.control}
                    name={`roles.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                          Team Member Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Organizer"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* email */}
                  <FormField
                    control={form.control}
                    name={`roles.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="john@doe.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* role */}
                  <FormField
                    control={form.control}
                    name={`roles.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                          Role
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isPending}
                          >
                            <SelectTrigger className="w-full border-[#ccd0de] py-6">
                              <SelectValue placeholder="Select a Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
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

                  {/* permission */}
                  <FormField
                    control={form.control}
                    name={`roles.${index}.permission`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-transforma-sans text-xs font-bold lg:text-sm">
                          Permission
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isPending}
                          >
                            <SelectTrigger className="w-full border-[#ccd0de] py-6">
                              <SelectValue placeholder="Select a Permission" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Permission</SelectLabel>
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

                  {/* Enable seat selection  */}
                  <FormField
                    control={form.control}
                    name={`roles.${index}.white_label`}
                    render={({ field }) => (
                      <FormItem className="flex lg:gap-7">
                        <FormLabel className="font-transforma-sans mb-0 text-xs font-bold lg:text-sm">
                          Enable White Label Mode
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

                <div className="p-4">
                  <h3 className="font-transforma-sans rounded-xl bg-[#efefef] p-5 text-xs text-black">
                    Join us at TechWave Summit 2024, the premier gathering for
                    technology enthusiasts, innovators, industry leaders, and
                    visionaries. Over three exciting days, discover the
                    cutting-edge advancements shaping tomorrow's world in AI,
                    cybersecurity, blockchain, cloud computing, and more.
                  </h3>
                </div>

                {index > 0 && (
                  <div className="flex items-end justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => remove(index)}
                      className="text-destructive auto border-0 bg-transparent shadow-none hover:bg-transparent"
                    >
                      <Trash2 className="h-3 w-3" /> Remove Role
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-5 flex items-center justify-end gap-5">
          <p className="font-transforma-sans text-xs font-medium">
            Up Next <span className="font-bold">Review & Submit</span>
          </p>
          <Button
            type="submit"
            className="h-12 w-auto rounded-xl lg:px-20"
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : 'Next'}
          </Button>
        </div>
      </form>{' '}
    </Form>
  )
}
