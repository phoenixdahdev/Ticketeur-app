import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import type { Auth } from './server'

export function createGuards(auth: Auth) {
  async function getSession() {
    return auth.api.getSession({ headers: await headers() })
  }

  async function requireAuth() {
    const session = await getSession()
    if (!session) redirect('/login')
    return session
  }

  async function requireRole(allowed: Array<string>) {
    const session = await requireAuth()
    const role = session.user.role ?? 'attendee'
    if (!allowed.includes(role)) redirect('/')
    return session
  }

  async function requireApiAuth(request: Request) {
    return auth.api.getSession({ headers: request.headers })
  }

  return { getSession, requireAuth, requireRole, requireApiAuth }
}
