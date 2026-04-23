'use client'

import { createAuthClient } from 'better-auth/react'
import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
  twoFactorClient,
} from 'better-auth/client/plugins'

import {
  ac,
  attendee,
  organizer,
  vendor,
  admin as adminRole,
} from '@ticketur/auth/permissions'
import type { Auth } from './auth'

type AuthClient = ReturnType<typeof createAuthClient>

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  plugins: [
    inferAdditionalFields<Auth>(),
    emailOTPClient(),
    twoFactorClient({
      twoFactorPage: '/two-factor',
    }),
    adminClient({
      ac,
      roles: { attendee, organizer, vendor, admin: adminRole },
    }),
  ],
}) satisfies AuthClient

export const signIn = authClient.signIn
export const signOut = authClient.signOut
export const useSession = authClient.useSession
export const twoFactor = authClient.twoFactor
export const requestPasswordReset = authClient.requestPasswordReset
export const resetPassword = authClient.resetPassword
