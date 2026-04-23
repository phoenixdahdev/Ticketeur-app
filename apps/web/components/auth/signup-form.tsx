'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HugeiconsIcon } from '@hugeicons/react'
import { ViewIcon, ViewOffSlashIcon } from '@hugeicons/core-free-icons'

import { Button } from '@ticketur/ui/components/button'
import { Input } from '@ticketur/ui/components/input'
import { Textarea } from '@ticketur/ui/components/textarea'
import { Checkbox } from '@ticketur/ui/components/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@ticketur/ui/components/field'

import {
  SIGNUP_SCHEMAS,
  getSignupDefaultValues,
  type SignupRoleConfig,
} from '@/lib/signup-roles'
import { PasswordStrength } from '@/components/auth/password-strength'
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons'

type SignupFormValues = {
  fullName?: string
  orgName?: string
  orgType?: string
  businessName?: string
  category?: string
  description?: string
  email?: string
  password: string
  agree: boolean
}

export function SignupForm({ config }: { config: SignupRoleConfig }) {
  const [showPassword, setShowPassword] = useState(false)

  const schema = SIGNUP_SCHEMAS[config.role]
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<SignupFormValues>,
    defaultValues: getSignupDefaultValues(config) as SignupFormValues,
    mode: 'onTouched',
  })

  const password = form.watch('password') ?? ''

  function onSubmit(data: SignupFormValues) {
    console.log('signup submit', { role: config.role, data })
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}  
      noValidate
    >
      <FieldGroup>
        {config.fields.map((field) => (
          <Controller
            key={field.name}
            name={field.name as keyof SignupFormValues}
            control={form.control}
            render={({ field: rhf, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor={rhf.name}
                  className="text-foreground text-base font-semibold"
                >
                  {field.label}
                </FieldLabel>
                {field.type === 'textarea' ? (
                  <Textarea
                    name={rhf.name}
                    ref={rhf.ref}
                    value={typeof rhf.value === 'string' ? rhf.value : ''}
                    onChange={rhf.onChange}
                    onBlur={rhf.onBlur}
                    id={rhf.name}
                    placeholder={field.placeholder}
                    rows={3}
                    aria-invalid={fieldState.invalid}
                    className="min-h-20 resize-none rounded-[8px] py-3.5"
                  />
                ) : (
                  <Input
                    name={rhf.name}
                    ref={rhf.ref}
                    value={typeof rhf.value === 'string' ? rhf.value : ''}
                    onChange={rhf.onChange}
                    onBlur={rhf.onBlur}
                    id={rhf.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    aria-invalid={fieldState.invalid}
                  />
                )}
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        ))}

        <Controller
          name="password"
          control={form.control}
          render={({ field: rhf, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel
                htmlFor={rhf.name}
                className="text-foreground text-base font-semibold"
              >
                Password
              </FieldLabel>
              <div className="relative">
                <Input
                  name={rhf.name}
                  ref={rhf.ref}
                  value={typeof rhf.value === 'string' ? rhf.value : ''}
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
              <PasswordStrength password={password ?? ''} />
            </Field>
          )}
        />
      </FieldGroup>

      <Controller
        name="agree"
        control={form.control}
        render={({ field: rhf, fieldState }) => (
          <Field
            orientation="horizontal"
            className="items-start gap-3"
            data-invalid={fieldState.invalid || undefined}
          >
            <Checkbox
              id="agree"
              checked={!!rhf.value}
              onCheckedChange={(v) => rhf.onChange(v === true)}
              onBlur={rhf.onBlur}
              aria-invalid={fieldState.invalid}
              className="mt-0.5"
            />
            <div className="flex flex-1 flex-col gap-1">
              <FieldLabel
                htmlFor="agree"
                className="text-muted-foreground text-sm leading-5 font-normal"
              >
                <span className="block">
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="text-primary font-medium hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-primary font-medium hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </FieldLabel>
              <FieldError errors={[fieldState.error]} />
            </div>
          </Field>
        )}
      />

      <Button
        type="submit"
        size="xl"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? 'Creating account…' : 'Sign Up'}
      </Button>

      <FieldSeparator>or</FieldSeparator>

      <SocialAuthButtons />
    </form>
  )
}
