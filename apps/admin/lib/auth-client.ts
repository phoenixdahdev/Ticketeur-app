'use client'

import { createClient, type AuthClient } from '@ticketur/auth/client'

export const authClient: AuthClient = createClient(
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'
)

// Indexed-access annotations keep declaration emit portable — without them the
// inferred types reference better-auth internal dist paths (InferSignUpEmailCtx
// etc.) that cannot be named (TS2742/TS2883).
export const signIn: AuthClient['signIn'] = authClient.signIn
export const signOut: AuthClient['signOut'] = authClient.signOut
export const useSession: AuthClient['useSession'] = authClient.useSession
export const twoFactor: AuthClient['twoFactor'] = authClient.twoFactor
export const requestPasswordReset: AuthClient['requestPasswordReset'] =
  authClient.requestPasswordReset
export const resetPassword: AuthClient['resetPassword'] =
  authClient.resetPassword
