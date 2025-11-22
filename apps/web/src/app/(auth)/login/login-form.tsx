'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@useticketeur/ui/form'
import Link from 'next/link'
import { toast } from 'sonner'
import { Input } from '@useticketeur/ui/input'
import { login } from '../action'
import { Button } from '@useticketeur/ui/button'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from '@bprogress/next/app'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type LoginFormType, loginSchema } from '../schema'
import { cn } from '@useticketeur/ui/lib/utils'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  function onSubmit(values: LoginFormType) {
    startTransition(async () => {
      await login(values).then(async (res) => {
        if (res.success) {
          toast.success('Logged in successfully!', {
            description: 'Welcome back!',
            duration: 8000,
          })
          if (res.user?.is_verified) {
            await signIn('credentials', {
              email: values.email,
              password: values.password,
              redirectTo: '/',
            })
          }
        } else {
          if (res.type === 'account-verification') {
            router.push('/verify-account')
            toast.info('Please verify your email to log in.', {
              description: 'A verification email has been sent to your inbox.',
              duration: 8000,
            })
          } else {
            toast.error(res.error || 'Login Error', {
              description: 'Please try again later.',
              duration: 8000,
            })
          }
        }
      })
    })
  }

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[563px] flex-col gap-6',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-2 text-left">
        <h1 className="font-mono text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Please enter your credentials to log in
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="m@example.com"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      placeholder="************"
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="h-12 w-full rounded-xl"
            disabled={isPending}
          >
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>

      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
      </div>

      {/* Google Auth Button */}
      <Button
        variant="outline"
        className="h-12 w-full rounded-xl bg-transparent"
        onClick={() => {
          signIn('google', { redirectTo: '/' })
        }}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  )
}
