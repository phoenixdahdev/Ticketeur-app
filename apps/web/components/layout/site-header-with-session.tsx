import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { SiteHeader } from '@/components/layout/site-header'

export async function SiteHeaderWithSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const role =
    (session?.user as unknown as { role?: string | null } | undefined)?.role ??
    null

  return (
    <SiteHeader
      session={
        session
          ? {
              user: {
                name: session.user.name,
                email: session.user.email,
                image: session.user.image ?? null,
              },
              role,
            }
          : null
      }
    />
  )
}
