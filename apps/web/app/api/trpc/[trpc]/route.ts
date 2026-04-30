import { appRouter, createTRPCContext } from '@ticketur/api'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { auth } from '@/lib/auth'

const handler = async (req: Request) => {
  const session = await auth.api.getSession({ headers: req.headers })

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ session }),
  })
}

export { handler as GET, handler as POST }
