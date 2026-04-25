'use client'

import { useMemo, useState } from 'react'
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlusSignIcon,
  Delete02Icon,
  Cancel01Icon,
  Search01Icon,
  Image01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'
import { Input } from '@ticketur/ui/components/input'
import { Textarea } from '@ticketur/ui/components/textarea'
import { Calendar } from '@ticketur/ui/components/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ticketur/ui/components/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ticketur/ui/components/select'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@ticketur/ui/components/field'

import {
  REGISTERED_VENDORS,
  VENDOR_CATEGORIES,
  createEventSchema,
  externalVendorSchema,
  type CreateEventValues,
  type ExternalVendorValues,
  type RegisteredVendor,
} from '@/lib/create-event-schema'

export function FormView({
  values,
  onChange,
  banner,
  onBannerChange,
  onPreview,
  onSaveDraft,
}: {
  values: CreateEventValues
  onChange: (next: CreateEventValues) => void
  banner: string | null
  onBannerChange: (next: string | null) => void
  onPreview: () => void
  onSaveDraft: () => void
}) {
  const form = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: values,
    mode: 'onTouched',
  })

  const tiers = useFieldArray({ control: form.control, name: 'tiers' })

  const onSubmit: SubmitHandler<CreateEventValues> = (data) => {
    onChange(data)
    onPreview()
  }

  function saveDraft() {
    onChange(form.getValues())
    onSaveDraft()
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto md:gap-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      noValidate
    >
      <header className="flex shrink-0 flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Create New Event
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Set up your event details, ticketing, and manage vendors.
        </p>
      </header>

      <Section title="Basic Information">
        <BannerUploader value={banner} onChange={onBannerChange} />

        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="title" className="text-sm font-semibold">
                Event Title
              </FieldLabel>
              <Input
                {...field}
                id="title"
                value={field.value ?? ''}
                placeholder="e.g. Summer Music Festival 2026"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel
                htmlFor="description"
                className="text-sm font-semibold"
              >
                Event Description
              </FieldLabel>
              <Textarea
                {...field}
                id="description"
                value={field.value ?? ''}
                placeholder="Tell your audience what to expect"
                rows={4}
                className="min-h-24 resize-none rounded-[8px]"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="date" className="text-sm font-semibold">
                  Date
                </FieldLabel>
                <DatePicker
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="time"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="time" className="text-sm font-semibold">
                  Time
                </FieldLabel>
                <Input
                  {...field}
                  id="time"
                  type="time"
                  value={field.value ?? ''}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor="location"
                  className="text-sm font-semibold"
                >
                  Location
                </FieldLabel>
                <Input
                  {...field}
                  id="location"
                  value={field.value ?? ''}
                  placeholder="Enter precise venue"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <FeaturesEditor form={form} />
      </Section>

      <Section
        title="Ticket Tiers"
        action={
          <button
            type="button"
            onClick={() =>
              tiers.append({ name: '', quantity: 100, price: 0 })
            }
            className="text-primary inline-flex items-center gap-1 text-sm font-semibold hover:underline"
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              className="size-4"
              strokeWidth={2}
            />
            Add Ticket Tier
          </button>
        }
      >
        <div className="flex flex-col gap-4">
          {tiers.fields.map((f, i) => (
            <div
              key={f.id}
              className="border-border/60 grid grid-cols-1 items-end gap-3 rounded-xl border p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <Controller
                name={`tiers.${i}.name`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel className="text-xs font-semibold">
                      Ticket Name
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="Enter ticket name"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name={`tiers.${i}.quantity`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel className="text-xs font-semibold">
                      Quantity
                    </FieldLabel>
                    <Input
                      type="number"
                      min={1}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                      placeholder="100"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name={`tiers.${i}.price`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel className="text-xs font-semibold">
                      Price (₦)
                    </FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                      placeholder="0"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <button
                type="button"
                onClick={() => tiers.remove(i)}
                aria-label="Remove tier"
                disabled={tiers.fields.length <= 1}
                className="text-destructive hover:bg-destructive/10 inline-flex size-10 items-center justify-center self-end rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-30"
              >
                <HugeiconsIcon
                  icon={Delete02Icon}
                  className="size-4"
                  strokeWidth={1.8}
                />
              </button>
            </div>
          ))}
        </div>
      </Section>

      <VendorsEditor form={form} />

      <div className="flex shrink-0 flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-center md:gap-4">
        <Button type="submit" size="xl" className="w-full md:w-56">
          Publish Event
        </Button>
        <Button
          type="button"
          size="xl"
          variant="outline"
          className="w-full md:w-44"
          onClick={saveDraft}
        >
          Save to Draft
        </Button>
      </div>
    </form>
  )
}

function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="border-border/60 bg-background flex shrink-0 flex-col gap-4 rounded-2xl border p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
          {title}
        </h2>
        {action}
      </div>
      <FieldGroup className="gap-4">{children}</FieldGroup>
    </section>
  )
}

function DatePicker({
  value,
  onChange,
  onBlur,
  invalid,
}: {
  value: string
  onChange: (next: string) => void
  onBlur: () => void
  invalid: boolean
}) {
  const [open, setOpen] = useState(false)
  const selected = value ? new Date(`${value}T00:00:00`) : undefined
  const display = selected
    ? selected.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    : ''

  function toIso(d: Date) {
    const y = d.getFullYear()
    const m = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) onBlur()
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-invalid={invalid}
          className={cn(
            'border-input bg-background hover:border-primary/60 flex h-10 w-full items-center justify-between rounded-md border px-3 text-sm transition-colors',
            !value && 'text-muted-foreground',
            invalid && 'border-destructive'
          )}
        >
          <span className={cn('truncate', !value && 'font-normal')}>
            {display || 'Pick a date'}
          </span>
          <HugeiconsIcon
            icon={Calendar03Icon}
            className="text-muted-foreground size-4 shrink-0"
            strokeWidth={1.8}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (d) {
              onChange(toIso(d))
              setOpen(false)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function BannerUploader({
  value,
  onChange,
}: {
  value: string | null
  onChange: (next: string | null) => void
}) {
  function handleFile(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Field>
      <FieldLabel className="text-sm font-semibold">Event Banner</FieldLabel>
      <label
        className={cn(
          'border-border/60 bg-muted/40 hover:border-primary/60 hover:bg-primary/5 group relative flex min-h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed transition-colors md:min-h-40',
          value && 'border-solid'
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Event banner preview"
              className="h-full max-h-56 w-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onChange(null)
              }}
              aria-label="Remove banner"
              className="bg-background text-foreground hover:bg-destructive hover:text-destructive-foreground absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-full shadow-sm transition-colors"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                className="size-4"
                strokeWidth={2}
              />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 px-6 py-8 text-center">
            <span className="bg-background text-muted-foreground flex size-10 items-center justify-center rounded-full">
              <HugeiconsIcon
                icon={Image01Icon}
                className="size-5"
                strokeWidth={1.8}
              />
            </span>
            <p className="text-muted-foreground text-sm">
              Click to upload or drag &amp; drop
            </p>
            <p className="text-muted-foreground text-xs">
              Recommended size: 1920×1080, JPG or PNG
            </p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="sr-only"
        />
      </label>
    </Field>
  )
}

function FeaturesEditor({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<CreateEventValues, any, any>
}) {
  const features = form.watch('features') ?? []
  const [draft, setDraft] = useState('')

  function add() {
    const v = draft.trim()
    if (!v) return
    if (features.includes(v)) {
      toast('Already added', { description: `“${v}” is already on the list.` })
      setDraft('')
      return
    }
    form.setValue('features', [...features, v], { shouldDirty: true })
    setDraft('')
  }

  function remove(value: string) {
    form.setValue(
      'features',
      features.filter((f) => f !== value),
      { shouldDirty: true }
    )
  }

  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel className="text-sm font-semibold">Features</FieldLabel>
        <button
          type="button"
          onClick={add}
          className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            className="size-3.5"
            strokeWidth={2}
          />
          Add features
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder="e.g. Live DJ Sets"
        />
      </div>
      {features.length > 0 ? (
        <ul className="flex flex-wrap gap-2 pt-1">
          {features.map((f) => (
            <li
              key={f}
              className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            >
              {f}
              <button
                type="button"
                onClick={() => remove(f)}
                aria-label={`Remove ${f}`}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  className="size-3"
                  strokeWidth={2}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </Field>
  )
}

function VendorsEditor({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<CreateEventValues, any, any>
}) {
  const assigned = form.watch('assignedVendorIds') ?? []
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('All Categories')
  const [inviteOpen, setInviteOpen] = useState(false)

  const inviteForm = useForm<ExternalVendorValues>({
    resolver: zodResolver(externalVendorSchema),
    mode: 'onTouched',
    defaultValues: {
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
    },
  })

  const assignedVendors = useMemo(
    () => REGISTERED_VENDORS.filter((v) => assigned.includes(v.id)),
    [assigned]
  )
  const browseable = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return REGISTERED_VENDORS.filter((v) => !assigned.includes(v.id))
      .filter(
        (v) => category === 'All Categories' || v.category === category
      )
      .filter(
        (v) =>
          !needle ||
          v.name.toLowerCase().includes(needle) ||
          v.description.toLowerCase().includes(needle) ||
          v.category.toLowerCase().includes(needle)
      )
  }, [assigned, search, category])

  function unassign(id: string) {
    form.setValue(
      'assignedVendorIds',
      assigned.filter((vId) => vId !== id),
      { shouldDirty: true }
    )
  }

  function assign(id: string) {
    if (assigned.includes(id)) return
    form.setValue('assignedVendorIds', [...assigned, id], { shouldDirty: true })
  }

  function sendInvite(values: ExternalVendorValues) {
    toast.success('Invitation sent', {
      description: `An invitation has been sent to ${values.email}.`,
    })
    inviteForm.reset()
    setInviteOpen(false)
  }

  return (
    <section className="border-border/60 bg-background flex shrink-0 flex-col gap-4 rounded-2xl border p-5 md:p-6">
      <h2 className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
        Assign Vendors
      </h2>

      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm font-medium">Assigned</p>
        {assignedVendors.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No vendors assigned yet — pick from the list below.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {assignedVendors.map((v) => (
              <VendorCard
                key={v.id}
                vendor={v}
                onAction={() => unassign(v.id)}
                action="remove"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm font-medium">
          Search registered vendors to partner with for this event.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
              strokeWidth={1.8}
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-10 pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              Filter by
            </span>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10! w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENDOR_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {browseable.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            No vendors match these filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {browseable.map((v) => (
              <VendorCard
                key={v.id}
                vendor={v}
                onAction={() => assign(v.id)}
                action="add"
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-border/60 -mx-5 mt-2 border-t md:-mx-6">
        <button
          type="button"
          onClick={() => setInviteOpen((v) => !v)}
          aria-expanded={inviteOpen}
          className="text-primary flex w-full items-center justify-between px-5 py-4 text-sm font-semibold md:px-6"
        >
          Invite External Vendor
          <HugeiconsIcon
            icon={inviteOpen ? ArrowDown01Icon : ArrowRight01Icon}
            className="size-4"
            strokeWidth={2}
          />
        </button>
        {inviteOpen ? (
          <div className="flex flex-col gap-4 px-5 pb-5 md:px-6 md:pb-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                name="businessName"
                control={inviteForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel className="text-xs font-semibold">
                      Vendor Business Name
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="e.g. Bushwick Security Solutions"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="contactName"
                control={inviteForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel className="text-xs font-semibold">
                      Vendor&apos;s Name
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="e.g. Tobi Jones"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={inviteForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel className="text-xs font-semibold">
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      value={field.value ?? ''}
                      placeholder="contact@example.com"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="phone"
                control={inviteForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel className="text-xs font-semibold">
                      Phone Number
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="+234 (0) 000 000 0000"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Button
                type="button"
                size="xl"
                className="w-full sm:w-56"
                onClick={() => void inviteForm.handleSubmit(sendInvite)()}
              >
                Send Invitation
              </Button>
              <Button
                type="button"
                size="xl"
                variant="outline"
                className="w-full sm:w-40"
                onClick={() => {
                  inviteForm.reset()
                  setInviteOpen(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function VendorCard({
  vendor,
  onAction,
  action,
}: {
  vendor: RegisteredVendor
  onAction: () => void
  action: 'add' | 'remove'
}) {
  return (
    <div className="border-border/60 bg-background relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-3">
      <div className="bg-primary/10 relative flex h-24 items-center justify-center overflow-hidden rounded-xl">
        <span className="font-heading text-primary text-3xl font-bold opacity-60">
          {vendor.name.charAt(0)}
        </span>
        <span
          className={cn(
            'absolute top-2 left-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
            vendor.status === 'verified'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
          )}
        >
          {vendor.status}
        </span>
        <button
          type="button"
          onClick={onAction}
          aria-label={action === 'add' ? `Add ${vendor.name}` : `Remove ${vendor.name}`}
          className={cn(
            'absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full shadow-sm transition-colors',
            action === 'add'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-background text-foreground hover:bg-destructive hover:text-destructive-foreground'
          )}
        >
          <HugeiconsIcon
            icon={action === 'add' ? PlusSignIcon : Cancel01Icon}
            className="size-3.5"
            strokeWidth={2}
          />
        </button>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <p className="text-foreground text-sm font-semibold">{vendor.name}</p>
        <p className="text-muted-foreground line-clamp-2 text-xs leading-5">
          {vendor.description}
        </p>
      </div>
    </div>
  )
}
