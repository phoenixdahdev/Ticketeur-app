'use client'

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
import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { createRoleSchema, type CreateRoleType } from './schema'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@useticketeur/ui/select'
import { useEventStore, type RoleMember } from '@/hooks/use-event-store'
import { eventMemberRoles } from '@useticketeur/db'

const permissions = ['view_only', 'edit', 'full_access'] as const

export function CreateRoleForm() {
  const router = useRouter()
  const { members, setMembers, setCurrentStep } = useEventStore()

  const form = useForm<CreateRoleType>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      roles:
        members.length > 0
          ? members.map((m) => ({
              name: m.name || '',
              email: m.email || '',
              role: m.role || '',
              permission: m.permissions[0] || '',
              white_label: false,
            }))
          : [
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
      // Save to Zustand store
      const formattedMembers: RoleMember[] = values.roles.map((r) => ({
        name: r.name,
        email: r.email,
        role: r.role as RoleMember['role'],
        permissions: r.permission ? [r.permission] : [],
      }))
      setMembers(formattedMembers)
      setCurrentStep(5)
      router.push('/events/create/preview')
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
            Add Team Member
          </Button>
        </div>

        <div className="mt-5 rounded-xl border border-[#dfdfdf] bg-[#fcfcfc]">
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="">
                <div className="grid gap-5 p-4 pb-0 lg:grid-cols-2">
                  {/* Team Member Name */}
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
                            placeholder="John Doe"
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
                                {eventMemberRoles.map((role) => (
                                  <SelectItem
                                    key={role}
                                    value={role}
                                    className="capitalize"
                                  >
                                    {role}
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
                          Permissions
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
                                <SelectLabel>Permissions</SelectLabel>
                                {permissions.map((permission) => (
                                  <SelectItem
                                    key={permission}
                                    value={permission}
                                    className="capitalize"
                                  >
                                    {permission.replace('_', ' ')}
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

                {index > 0 && (
                  <div className="flex items-end justify-end p-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => remove(index)}
                      className="text-destructive auto border-0 bg-transparent shadow-none hover:bg-transparent"
                    >
                      <Trash2 className="h-3 w-3" /> Remove Member
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
      </form>
    </Form>
  )
}
