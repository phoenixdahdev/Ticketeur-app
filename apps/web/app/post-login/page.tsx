import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth'
import { getPostLoginPath } from '@/lib/post-login-redirect'

export const dynamic = 'force-dynamic'

export default async function PostLoginPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  const role =
    (session.user as unknown as { role?: string | null }).role ?? null
  redirect(getPostLoginPath(role))
}
