import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, twoFactor, emailOTP } from 'better-auth/plugins'
import { tasks } from '@trigger.dev/sdk'

import { db } from '@ticketur/db'
import { env } from '@ticketur/env/core'

import {
  ac,
  attendee,
  organizer,
  vendor,
  admin as adminRole,
} from './permissions'
import { userAdditionalFields } from './fields'

export function createAuth(cookiePrefix: string) {
  return betterAuth({
    appName: 'Ticketur',
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, { provider: 'pg' }),

    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
    },

    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        await tasks.trigger('send-password-reset', {
          email: user.email,
          name: user.name,
          resetUrl: url,
        })
      },
    },

    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        enabled: env.GOOGLE_CLIENT_ID !== '' && env.GOOGLE_CLIENT_SECRET !== '',
      },
    },

    plugins: [
      emailOTP({
        overrideDefaultEmailVerification: true,
        sendVerificationOnSignUp: true,
        otpLength: 6,
        expiresIn: 600,
        async sendVerificationOTP({ email, otp, type }) {
          await tasks.trigger('send-verification-otp', {
            email,
            otp,
            type,
          })
        },
      }),
      twoFactor({
        issuer: 'Ticketur',
        otpOptions: {
          sendOTP: async ({ user, otp }) => {
            await tasks.trigger('send-two-factor-otp', {
              email: user.email,
              otp,
            })
          },
        },
      }),
      admin({
        ac,
        roles: {
          attendee,
          organizer,
          vendor,
          admin: adminRole,
        },
        defaultRole: 'attendee',
        adminRoles: ['admin'],
      }),
    ],

    user: {
      // Shape lives in ./fields so the client's inferAdditionalFields() reuses
      // the exact same object. `role` is absent here on purpose — it's owned by
      // the admin plugin and rejected as input (FIELD_NOT_ALLOWED); clients send
      // `requestedRole`, which the databaseHook below promotes to `role`.
      additionalFields: userAdditionalFields,
    },

    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            // Promote the client-submitted `requestedRole` to `role` after
            // validating it against our business roles. `admin` is never
            // self-assignable — platform admin has to go through
            // auth.api.setRole with an existing admin session.
            const allowed = ['attendee', 'organizer', 'vendor']
            const requested = (user as unknown as Record<string, unknown>)
              .requestedRole
            const candidate = typeof requested === 'string' ? requested : ''
            const role = allowed.includes(candidate) ? candidate : 'attendee'
            // Vendors must be approved by an admin before they can be assigned
            // to events. Approval status starts as null ("profile not yet
            // submitted") — it flips to 'pending' the first time they save
            // their profile via vendor.profile.update, which is when the
            // admin moderation queue should pick them up.
            return { data: { ...user, role, vendorApprovalStatus: null } }
          },
          after: async (user) => {
            // Fire and forget — a failing welcome email must not block signup.
            void tasks.trigger('send-welcome', {
              email: user.email,
              name: user.name,
            })
          },
        },
      },
    },

    advanced: {
      cookiePrefix,
    },
    trustedOrigins: [...(env.APP_URLS ?? []), env.BETTER_AUTH_URL],
  })
}

export type Auth = ReturnType<typeof createAuth>
export type Session = Awaited<ReturnType<Auth['api']['getSession']>>
