'use client'

import { useEffect, useRef, useTransition } from 'react'
import Image from 'next/image'
import {
  Controller,
  useForm,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import { Image01Icon } from '@hugeicons/core-free-icons'
import { z } from 'zod'

import { Button } from '@ticketur/ui/components/button'
import { Input } from '@ticketur/ui/components/input'
import { Field, FieldError, FieldLabel } from '@ticketur/ui/components/field'

import { useTRPC } from '@/lib/trpc'
import { uploadFile } from '@/lib/upload'

const orgProfileSchema = z.object({
  name: z.string().trim().min(1, 'Your name is required'),
  orgName: z.string().trim().min(1, 'Organization name is required'),
  orgType: z.string().trim().max(80).optional(),
  image: z.string().nullable().optional(),
})

type OrgProfileValues = z.infer<typeof orgProfileSchema>

const DEFAULTS: OrgProfileValues = {
  name: '',
  orgName: '',
  orgType: '',
  image: null,
}

export function OrgProfileContent() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const form = useForm<OrgProfileValues>({
    resolver: zodResolver(orgProfileSchema),
    defaultValues: DEFAULTS,
    mode: 'onTouched',
  })

  const profileQuery = useQuery(trpc.org.profile.get.queryOptions())
  const email = profileQuery.data?.email ?? ''

  // Populate the form once the server returns the persisted profile. Skip
  // while the form is dirty so a background refetch can't clobber edits the
  // user is in the middle of typing.
  useEffect(() => {
    const data = profileQuery.data
    if (!data || form.formState.isDirty) return
    form.reset({
      name: data.name ?? '',
      orgName: data.orgName ?? '',
      orgType: data.orgType ?? '',
      image: data.image ?? null,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileQuery.data])

  const update = useMutation(
    trpc.org.profile.update.mutationOptions({
      onSuccess: () => {
        toast.success('Profile saved', {
          description: 'Your account details have been updated.',
        })
        // Adopt the saved values as the new pristine baseline immediately.
        form.reset(form.getValues())
        queryClient.invalidateQueries({
          queryKey: trpc.org.profile.get.queryKey(),
        })
      },
      onError: (e) =>
        toast.error('Could not save profile', { description: e.message }),
    })
  )

  const onSubmit: SubmitHandler<OrgProfileValues> = (values) => {
    update.mutate(values)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="flex min-h-0 flex-1 [scrollbar-width:none] flex-col gap-6 overflow-y-auto md:gap-8 [&::-webkit-scrollbar]:hidden"
    >
      <header className="flex shrink-0 flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Account Settings
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage your organizer account and organization details.
        </p>
      </header>

      <section className="border-border/60 bg-background flex flex-col gap-6 rounded-2xl border p-5 md:p-6">
        <LogoUploader form={form} />

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel className="text-sm font-semibold">
                Your Name
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder="Alex Johnson"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Field>
          <FieldLabel className="text-sm font-semibold">Email</FieldLabel>
          <Input value={email} disabled readOnly />
          <p className="text-muted-foreground text-xs">
            Your email address can&apos;t be changed here.
          </p>
        </Field>

        <Controller
          name="orgName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel className="text-sm font-semibold">
                Organization Name
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder="Acme Events Ltd."
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="orgType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel className="text-sm font-semibold">
                Organization Type
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder="e.g. Concert promoter, Conference organizer"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </section>

      <div className="flex shrink-0 items-center justify-end gap-3 pb-2">
        <Button
          type="submit"
          size="xl"
          className="w-full sm:w-auto sm:min-w-48"
          disabled={update.isPending}
        >
          {update.isPending ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

function LogoUploader({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<OrgProfileValues, any, any>
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const logoUrl = form.watch('image')
  const [uploading, startUpload] = useTransition()

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    startUpload(async () => {
      try {
        const blob = await uploadFile({ kind: 'org-logo', file })
        form.setValue('image', blob.url, { shouldDirty: true })
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
    <div className="flex items-center gap-4">
      <div className="border-border/60 bg-muted relative size-20 shrink-0 overflow-hidden rounded-full border">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt="Organization logo"
            fill
            sizes="80px"
            className="object-cover"
            unoptimized={logoUrl.startsWith('data:')}
          />
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center">
            <HugeiconsIcon
              icon={Image01Icon}
              className="size-6"
              strokeWidth={1.8}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? 'Uploading…' : 'Upload logo'}
        </Button>
        {logoUrl ? (
          <button
            type="button"
            className="text-destructive text-xs font-medium hover:underline"
            onClick={() => form.setValue('image', null, { shouldDirty: true })}
          >
            Remove
          </button>
        ) : null}
      </div>
    </div>
  )
}
