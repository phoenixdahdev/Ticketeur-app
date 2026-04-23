import { createAuth, createGuards } from '@ticketur/auth'

export const auth = createAuth('ticketur')
export type Auth = typeof auth

export const { getSession, requireAuth, requireRole, requireApiAuth } =
  createGuards(auth)
