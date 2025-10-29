'use client'

import { toast } from 'sonner'
import { Button } from 'ui/button'
import { delay } from '~/lib/utils'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useState, useTransition } from 'react'
import { OtpFormType, otpschema } from '../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { resendverificationotp, verifyotp } from '../actions'
import CountdownTimer from '~/components/miscellaneous/count-down'
import { InputOTP, InputOTPGroup, InputOTPSlot } from 'ui/input-otp'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'ui/form'

export function EmailVerificationForm() {
  const [type, setType] = useState('')
  const [counterNumber, setCount] = useState(1)
  const [canResendEmail, setCanResendEmail] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<OtpFormType>({
    resolver: zodResolver(otpschema),
    defaultValues: {
      pin: '',
    },
  })

  function onSubmit(values: OtpFormType) {
    setType('verify')
    startTransition(async () => {
      await verifyotp(values.pin).then(async (res) => {
        if (res.success) {
          toast.success('OTP verified successfully!', {
            description: 'You can now access your account.',
          })
          await signIn('credentials', {
            email: res.user?.email,
            from_onboarding: true,
            redirectTo: '/onboarding',
          })
          form.reset()
        } else {
          toast.error('Failed to verify OTP. Please try again.', {
            description: res.error,
          })
        }
      })
    })
  }

  const handleResend = async () => {
    setType('resend')
    startTransition(async () => {
      await resendverificationotp().then((res) => {
        if (res.success) {
          toast.success('Verification OTP resent successfully!', {
            description: 'Please check your email for the new OTP.',
          })
          setCount((prev) => (prev += 1))
          delay(100).then(() => {
            setCanResendEmail(false)
            form.setValue('pin', '')
          })
        } else {
          toast.error('Failed to resend verification OTP. Please try again.', {
            description: res.error,
          })
        }
      })
    })
  }

  return (
    <div className="mx-auto w-full max-w-md items-center justify-center">
      <div className="space-y-2 pb-6 text-center">
        <h1 className="text-foreground text-2xl font-semibold">
          Verify your email
        </h1>
        <p className="text-muted-foreground text-sm">
          We&apos;ve sent a 6-digit code to your email. Please enter it below to
          continue.
        </p>
      </div>
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-y-4">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      pattern={REGEXP_ONLY_DIGITS}
                      onComplete={form.handleSubmit(onSubmit)}
                    >
                      <InputOTPGroup className="space-x-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="h-16 w-16 rounded-2xl text-base first:rounded-l-2xl last:rounded-r-2xl"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-foundation-black-400 space-y-3 text-center text-sm">
              <p>
                Code expires in{' '}
                <CountdownTimer
                  restartTrigger={counterNumber}
                  onExpire={() => setCanResendEmail(true)}
                />
              </p>
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl"
              disabled={isPending && type === 'verify'}
            >
              {isPending && type === 'verify'
                ? 'Please wait...'
                : 'Create Account'}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Didn&apos;t get the code?{' '}
            <button
              onClick={handleResend}
              disabled={
                (isPending && type === 'resend') || canResendEmail === false
              }
              className="text-foreground cursor-pointer font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending && type === 'resend' ? 'Sending...' : 'Resend'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
