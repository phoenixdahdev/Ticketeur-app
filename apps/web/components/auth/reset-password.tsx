'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from '@hugeicons/core-free-icons'

import { authClient } from '@/lib/auth-client'

import { Button } from '@ticketur/ui/components/button'
import { Input } from '@ticketur/ui/components/input'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@ticketur/ui/components/field'

import { passwordSchema } from '@/lib/signup-roles'
import { PasswordStrength } from '@/components/auth/password-strength'

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type Values = z.infer<typeof schema>

export function ResetPassword() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  const password = form.watch('password') ?? ''

  async function onSubmit(data: Values) {
    if (!token) {
      toast.error('Reset link is missing or invalid', {
        description: 'Request a new reset email from the forgot-password page.',
      })
      return
    }

    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token,
    })

    if (error) {
      toast.error('Could not reset password', {
        description: error.message ?? 'Your reset link may have expired.',
      })
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <>
        <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 flex size-14 items-center justify-center rounded-full">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="size-8"
            strokeWidth={2}
          />
        </div>

        <header className="flex flex-col gap-3">
          <h1 className="font-heading text-foreground text-2xl leading-tight font-bold tracking-tight md:text-[32px] md:leading-tight">
            Password Reset Successfully
          </h1>
          <p className="text-muted-foreground text-base leading-6">
            Your account security has been updated. You can now sign in with
            your new password.
          </p>
        </header>

        <Button size="xl" className="w-full" asChild>
          <Link href="/login">Back to Sign In</Link>
        </Button>
      </>
    )
  }

  return (
    <>
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-foreground text-2xl leading-tight font-bold tracking-tight md:text-[32px] md:leading-tight">
          Set New Password
        </h1>
        <p className="text-muted-foreground text-base leading-6">
          Choose a strong password to protect your account.
        </p>
      </header>

      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field: rhf, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor={rhf.name}
                  className="text-foreground text-base font-semibold"
                >
                  New Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    name={rhf.name}
                    ref={rhf.ref}
                    value={rhf.value ?? ''}
                    onChange={rhf.onChange}
                    onBlur={rhf.onBlur}
                    id={rhf.name}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 transition-colors"
                  >
                    <HugeiconsIcon
                      icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                      className="size-5"
                      strokeWidth={1.8}
                    />
                  </button>
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field: rhf, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor={rhf.name}
                  className="text-foreground text-base font-semibold"
                >
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    name={rhf.name}
                    ref={rhf.ref}
                    value={rhf.value ?? ''}
                    onChange={rhf.onChange}
                    onBlur={rhf.onBlur}
                    id={rhf.name}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={
                      showConfirm ? 'Hide password' : 'Show password'
                    }
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 transition-colors"
                  >
                    <HugeiconsIcon
                      icon={showConfirm ? ViewOffSlashIcon : ViewIcon}
                      className="size-5"
                      strokeWidth={1.8}
                    />
                  </button>
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <PasswordStrength password={password} />
        </FieldGroup>

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            size="xl"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Resetting…' : 'Reset Password'}
          </Button>
          <Button
            variant="outline-primary"
            size="xl"
            className="w-full"
            asChild
          >
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </div>
      </form>
    </>
  )
}
