'use client'

import { useRef, useState } from 'react'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Edit02Icon,
  Image01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'
import { Input } from '@ticketur/ui/components/input'
import { Textarea } from '@ticketur/ui/components/textarea'
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
  FieldLabel,
} from '@ticketur/ui/components/field'

import {
  VENDOR_BUSINESS_CATEGORIES,
  VENDOR_PROFILE_DEFAULTS,
  vendorProfileSchema,
  type VendorProfileValues,
} from '@/lib/vendor-profile-schema'

const MAX_SHOWCASE = 6

export function VendorProfileContent({
  initialValues = VENDOR_PROFILE_DEFAULTS,
}: {
  initialValues?: VendorProfileValues
}) {
  const form = useForm<VendorProfileValues>({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  })

  const onSubmit: SubmitHandler<VendorProfileValues> = (values) => {
    // UI-only for now — wire to mutation later.
    void values
    toast.success('Profile saved', {
      description: 'Your vendor profile has been updated.',
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto md:gap-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <header className="flex shrink-0 flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Profile Settings
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage your professional business identity and online presence.
        </p>
      </header>

      <BusinessIdentityCard form={form} />
      <ProductsShowcaseCard form={form} />

      <div className="flex shrink-0 items-center justify-end gap-3 pb-2">
        <Button
          type="submit"
          size="xl"
          className="w-full sm:w-auto sm:min-w-48"
          disabled={form.formState.isSubmitting}
        >
          Save
        </Button>
      </div>
    </form>
  )
}

function BusinessIdentityCard({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: ReturnType<typeof useForm<VendorProfileValues>>
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const logoUrl = form.watch('logoUrl')

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        form.setValue('logoUrl', result, { shouldDirty: true })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <section className="border-border/60 bg-background flex shrink-0 flex-col gap-5 rounded-2xl border p-5 md:p-6">
      <h2 className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
        Business Identity
      </h2>

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="bg-zinc-900 relative flex size-30 items-center justify-center overflow-hidden rounded-2xl text-white"
              aria-label="Update logo"
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Logo"
                  fill
                  className="object-cover"
                  unoptimized={logoUrl.startsWith('data:')}
                />
              ) : (
                <span className="font-heading text-xl font-extrabold tracking-tight">
                  B·RAND
                </span>
              )}
            </button>
            <span className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 inline-flex size-7 items-center justify-center rounded-full shadow-md">
              <HugeiconsIcon
                icon={Edit02Icon}
                className="size-3.5"
                strokeWidth={2}
              />
            </span>
          </div>
          <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Update Logo
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="businessName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel className="text-xs font-semibold">
                  Business Name
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder="e.g Tasty Bites"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="businessLocation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel className="text-xs font-semibold">
                  Business Location
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder="Enter Location"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="businessCategory"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel className="text-xs font-semibold">
                  Category
                </FieldLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {VENDOR_BUSINESS_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="businessDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid || undefined}
                className="md:col-span-2"
              >
                <FieldLabel className="text-xs font-semibold">
                  Business Description
                </FieldLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder="Give a short about your business"
                  rows={3}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="instagramUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel className="text-xs font-semibold">
                  Instagram URL
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder="e.g instagram.com/tastybites"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="websiteUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel className="text-xs font-semibold">
                  Website (optional)
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder="e.g www.tastybite.com"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>
      </div>
    </section>
  )
}

function ProductsShowcaseCard({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: ReturnType<typeof useForm<VendorProfileValues>>
}) {
  const showcase = form.watch('showcaseImages') ?? []
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploading(true)
    const remaining = MAX_SHOWCASE - showcase.length
    const accepted = files.slice(0, remaining)
    const dataUrls = await Promise.all(
      accepted.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
              const result = reader.result
              if (typeof result === 'string') resolve(result)
              else reject(new Error('Read failed'))
            }
            reader.onerror = () => reject(reader.error)
            reader.readAsDataURL(file)
          })
      )
    )
    form.setValue('showcaseImages', [...showcase, ...dataUrls], {
      shouldDirty: true,
    })
    if (fileRef.current) fileRef.current.value = ''
    setUploading(false)
  }

  function removeImage(idx: number) {
    form.setValue(
      'showcaseImages',
      showcase.filter((_, i) => i !== idx),
      { shouldDirty: true }
    )
  }

  return (
    <section className="border-border/60 bg-background flex shrink-0 flex-col gap-4 rounded-2xl border p-5 md:p-6">
      <h2 className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
        Products/Services Showcase
      </h2>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {showcase.map((src, idx) => (
          <div
            key={`${src.slice(0, 24)}-${idx}`}
            className="bg-zinc-900 group relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={src}
              alt={`Showcase ${idx + 1}`}
              fill
              sizes="(min-width: 768px) 160px, 33vw"
              className="object-cover"
              unoptimized={src.startsWith('data:')}
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              aria-label="Remove image"
              className="bg-background/90 text-foreground hover:bg-background absolute top-1.5 right-1.5 inline-flex size-6 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                className="size-3"
                strokeWidth={2}
              />
            </button>
          </div>
        ))}
        {showcase.length < MAX_SHOWCASE ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={cn(
              'border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed transition-colors',
              uploading && 'opacity-50'
            )}
          >
            <HugeiconsIcon
              icon={Image01Icon}
              className="size-5"
              strokeWidth={1.6}
            />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Upload New
            </span>
          </button>
        ) : null}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
    </section>
  )
}
