import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'

const AuthProvider = async ({ children }: { children: React.ReactNode }) => {
  'use cache: private'
  const session = await auth()
  return (
    <SessionProvider
      session={session}
      refetchInterval={5}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
}

export default AuthProvider
