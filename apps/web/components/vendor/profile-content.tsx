'use client'

import { useEffect, useRef, useTransition } from 'react'
import {
  useForm,
  Controller,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

import { useTRPC } from '@/lib/trpc'
import { uploadFile, type UploadKind } from '@/lib/upload'
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
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const form = useForm<VendorProfileValues>({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  })

  const profileQuery = useQuery(trpc.vendor.profile.get.queryOptions())

  // Reset form once the server returns the persisted profile so we don't
  // overwrite freshly typed input.
  useEffect(() => {
    const data = profileQuery.data
    if (!data) return
    form.reset({
      businessName: data.businessName ?? '',
      businessLocation: data.businessLocation ?? '',
      businessCategory: data.businessCategory ?? '',
      tagline: data.tagline ?? '',
      businessDescription: data.businessDescription ?? '',
      instagramUrl: data.instagramUrl ?? '',
      websiteUrl: data.websiteUrl ?? '',
      logoUrl: data.image ?? null,
      bannerUrl: data.bannerUrl ?? null,
      expertise: data.expertise ?? '',
      focus: data.focus ?? '',
      experience: data.experience ?? '',
      showcaseImages: data.showcaseImages ?? [],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileQuery.data])

  const update = useMutation(
    trpc.vendor.profile.update.mutationOptions({
      onSuccess: () => {
        toast.success('Profile saved', {
          description: 'Your vendor profile has been updated.',
        })
        queryClient.invalidateQueries({
          queryKey: trpc.vendor.profile.get.queryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.vendor.dashboard.stats.queryKey(),
        })
      },
      onError: (e) =>
        toast.error('Could not save profile', { description: e.message }),
    })
  )

  const onSubmit: SubmitHandler<VendorProfileValues> = (values) => {
    update.mutate(values)
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
      <PublicProfileCard form={form} />
      <ProductsShowcaseCard form={form} />

      <div className="flex shrink-0 items-center justify-end gap-3 pb-2">
        <Button
          type="submit"
          size="xl"
          className="w-full sm:w-auto sm:min-w-48"
          disabled={update.isPending}
        >
          {update.isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

function BusinessIdentityCard({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<VendorProfileValues, any, any>
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const logoUrl = form.watch('logoUrl')
  const [uploading, startUpload] = useTransition()

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    startUpload(async () => {
      try {
        const blob = await uploadFile({ kind: 'vendor-logo', file })
        form.setValue('logoUrl', blob.url, { shouldDirty: true })
      } catch (err) {
        toast.error('Could not upload logo', {
          description: (err as Error).message,
        })
      } finally {
        if (fileRef.current) fileRef.current.value = ''
      }
    })
  }

  return (
    <section className="border-border/60 bg-background flex shrink-0 flex-col gap-5 rounded-2xl border p-5 md:p-6">
      <h2 className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
        Business Identity
      </h2>

      <BannerUploader form={form} />

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="bg-zinc-900 relative flex size-30 items-center justify-center overflow-hidden rounded-2xl text-white disabled:opacity-70"
              aria-label="Update logo"
              aria-busy={uploading}
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
              {uploading ? (
                <span
                  aria-live="polite"
                  className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-bold tracking-wider uppercase"
                >
                  Uploading…
                </span>
              ) : null}
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
            name="tagline"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid || undefined}
                className="md:col-span-2"
              >
                <FieldLabel className="text-xs font-semibold">
                  Tagline
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder="One-line summary shown on your public page"
                  maxLength={160}
                  aria-invalid={fieldState.invalid}
                />
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
                  placeholder="Tell event attendees about your business — supports markdown"
                  rows={5}
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

function BannerUploader({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<VendorProfileValues, any, any>
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const bannerUrl = form.watch('bannerUrl')
  const [uploading, startUpload] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    startUpload(async () => {
      try {
        const blob = await uploadFile({ kind: 'vendor-banner', file })
        form.setValue('bannerUrl', blob.url, { shouldDirty: true })
      } catch (err) {
        toast.error('Could not upload banner', {
          description: (err as Error).message,
        })
      } finally {
        if (fileRef.current) fileRef.current.value = ''
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-foreground text-xs font-semibold">
        Cover Banner
      </span>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        aria-label={bannerUrl ? 'Replace banner' : 'Upload banner'}
        aria-busy={uploading}
        className="border-border/60 bg-muted hover:border-primary/40 group relative flex aspect-[1360/300] w-full overflow-hidden rounded-xl border-2 border-dashed transition-colors disabled:opacity-70"
      >
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt="Vendor banner"
            fill
            sizes="(min-width: 768px) 800px, 100vw"
            className="object-cover"
            unoptimized={bannerUrl.startsWith('data:')}
          />
        ) : (
          <span className="text-muted-foreground absolute inset-0 flex items-center justify-center text-xs font-bold tracking-wider uppercase">
            <HugeiconsIcon
              icon={Image01Icon}
              className="mr-2 size-5"
              strokeWidth={1.6}
            />
            Click to upload banner — recommended 1360 × 300
          </span>
        )}
        {bannerUrl && !uploading ? (
          <span className="bg-background/95 text-foreground absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold tracking-wider opacity-0 shadow transition-opacity group-hover:opacity-100">
            <HugeiconsIcon
              icon={Edit02Icon}
              className="size-3.5"
              strokeWidth={2}
            />
            Replace
          </span>
        ) : null}
        {uploading ? (
          <span
            aria-live="polite"
            className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-bold tracking-wider text-white uppercase"
          >
            Uploading…
          </span>
        ) : null}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}

function PublicProfileCard({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<VendorProfileValues, any, any>
}) {
  return (
    <section className="border-border/60 bg-background flex shrink-0 flex-col gap-4 rounded-2xl border p-5 md:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
          Public Profile Highlights
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Shown as the three stat tiles on your public vendor page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Controller
          name="expertise"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel className="text-xs font-semibold">
                Expertise
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder="e.g. Food, Stage Design"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="focus"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel className="text-xs font-semibold">Focus</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder="e.g. Tech conferences"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="experience"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel className="text-xs font-semibold">
                Experience
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder="e.g. 12+ Years"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>
    </section>
  )
}

function ProductsShowcaseCard({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<VendorProfileValues, any, any>
}) {
  const showcase = form.watch('showcaseImages') ?? []
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, startUpload] = useTransition()

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    const remaining = MAX_SHOWCASE - showcase.length
    const accepted = files.slice(0, remaining)
    if (accepted.length === 0) return

    startUpload(async () => {
      try {
        const blobs = await Promise.all(
          accepted.map((file) => uploadFile({ kind: 'vendor-showcase', file }))
        )
        form.setValue(
          'showcaseImages',
          [...showcase, ...blobs.map((b) => b.url)],
          { shouldDirty: true }
        )
      } catch (err) {
        toast.error('Could not upload images', {
          description: (err as Error).message,
        })
      } finally {
        if (fileRef.current) fileRef.current.value = ''
      }
    })
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
