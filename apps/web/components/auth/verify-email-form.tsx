'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@ticketur/ui/components/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@ticketur/ui/components/input-otp'

import { authClient } from '@/lib/auth-client'

export function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const [otp, setOtp] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [resending, startResend] = useTransition()

  async function verify(value: string) {
    if (!email) {
      toast.error('Missing email', {
        description: 'Open this page from the link we sent to your inbox.',
      })
      return
    }
    setVerifying(true)
    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp: value,
    })
    setVerifying(false)

    if (error) {
      toast.error('Invalid or expired code', {
        description: error.message ?? 'Double-check the code and try again.',
      })
      setOtp('')
      return
    }

    toast.success('Email verified', {
      description: 'You can now sign in to your account.',
    })
    router.push('/login')
  }

  function resend() {
    if (!email) {
      toast.error('Missing email', {
        description: 'Open this page from the link we sent to your inbox.',
      })
      return
    }
    startResend(async () => {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
      })
      if (error) {
        toast.error('Could not resend', {
          description: error.message ?? 'Please try again in a moment.',
        })
        return
      }
      toast.success('New code sent', { description: `Check ${email}.` })
    })
  }

  return (
    <>
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-foreground text-2xl leading-tight font-bold tracking-tight md:text-[32px] md:leading-tight">
          Verify your email
        </h1>
        <p className="text-muted-foreground text-base leading-6">
          {email ? (
            <>
              Enter the 6-digit code we sent to{' '}
              <span className="text-foreground font-medium">{email}</span>.
            </>
          ) : (
            'Enter the 6-digit code we sent to your email to finish setting up your account.'
          )}
        </p>
      </header>

      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className="flex flex-col items-center gap-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(v) => {
              setOtp(v)
              if (v.length === 6) void verify(v)
            }}
            disabled={verifying}
          >
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} className="size-12 text-lg" />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <p className="text-muted-foreground text-sm">
            Didn&apos;t get the code?{' '}
            <button
              type="button"
              onClick={resend}
              disabled={resending}
              className="text-primary font-medium hover:underline disabled:opacity-60"
            >
              {resending ? 'Sending…' : 'Resend'}
            </button>
          </p>
        </div>

        <p className="text-muted-foreground text-center text-sm">
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </>
  )
}
