import { registerOTel } from '@vercel/otel'
import type { Instrumentation } from 'next'

export function register() {
  registerOTel({ serviceName: 'ticketeur-web' })
}

export const onRequestError: Instrumentation.onRequestError = (
  err,
  request,
  context
) => {
  // Surface server-side errors to the platform logs with enough context to
  // trace back to the originating route. Plug a remote sink (Sentry, Axiom)
  // in here later if needed.
  console.error('[web] request error', {
    digest: (err as { digest?: string }).digest,
    message: err instanceof Error ? err.message : String(err),
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
  })
}
