import { createAuthClient } from 'better-auth/react'
import {
  adminClient,
  twoFactorClient,
  emailOTPClient,
} from 'better-auth/client/plugins'

import { ac, attendee, organizer, vendor } from './permissions'

export function createClient(baseURL: string) {
  return createAuthClient({
    baseURL,
    plugins: [
      emailOTPClient(),
      twoFactorClient({
        twoFactorPage: '/two-factor',
      }),
      adminClient({
        ac,
        roles: {
          attendee,
          organizer,
          vendor,
        },
      }),
    ],
  })
}

export type AuthClient = ReturnType<typeof createClient>
