'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'

import { Button } from '@ticketur/ui/components/button'
import { Input } from '@ticketur/ui/components/input'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@ticketur/ui/components/field'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

type Values = z.infer<typeof schema>

export function ForgotPassword() {
  const [email, setEmail] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  })

  function onSubmit(data: Values) {
    startTransition(async () => {
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: '/reset-password',
      })

      if (error) {
        toast.error('Could not send reset link', {
          description: error.message ?? 'Please try again.',
        })
        return
      }

      setEmail(data.email)
    })
  }

  if (email) {
    return (
      <>
        <header className="flex flex-col gap-3">
          <h1 className="font-heading text-foreground text-2xl leading-tight font-bold tracking-tight md:text-[32px] md:leading-tight">
            Check your email
          </h1>
          <p className="text-muted-foreground text-base leading-6">
            We&apos;ve sent a password reset link to{' '}
            <span className="text-foreground font-medium">{email}</span>.
            Please follow the instructions to reset your password.
          </p>
        </header>

        <button
          type="button"
          onClick={() => {
            form.handleSubmit(onSubmit)()
          }}
          className="text-primary self-start text-sm font-medium hover:underline"
        >
          Didn&apos;t receive the email? Click to resend
        </button>

        <div className="flex flex-col gap-3">
          <Button size="xl" className="w-full" asChild>
            <a href="mailto:">Open Email App</a>
          </Button>
          <Button variant="outline-primary" size="xl" className="w-full" asChild>
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-foreground text-2xl leading-tight font-bold tracking-tight md:text-[32px] md:leading-tight">
          Forgot password?
        </h1>
        <p className="text-muted-foreground text-base leading-6">
          Enter the email address linked to your account and we&apos;ll send
          you a reset link.
        </p>
      </header>

      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field: rhf, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor={rhf.name}
                  className="text-foreground text-base font-semibold"
                >
                  Email Address
                </FieldLabel>
                <Input
                  name={rhf.name}
                  ref={rhf.ref}
                  value={rhf.value ?? ''}
                  onChange={rhf.onChange}
                  onBlur={rhf.onBlur}
                  id={rhf.name}
                  type="email"
                  placeholder="alex@example.com"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            size="xl"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Sending…' : 'Send Reset Link'}
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
