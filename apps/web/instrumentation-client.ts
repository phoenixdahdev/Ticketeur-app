// Runs after the HTML loads but before React hydrates. Keep it under
// ~16ms — Next.js will warn in dev if init is slower than that.
//
// Hook a real provider (Sentry, Axiom, Datadog RUM) into `report*` calls
// later without restructuring this file.

try {
  performance.mark('app-init')

  window.addEventListener('error', (event) => {
    reportClientError(event.error ?? event.message, 'error')
  })

  window.addEventListener('unhandledrejection', (event) => {
    reportClientError(event.reason, 'unhandledrejection')
  })
} catch (err) {
  // Never let instrumentation crash the page.
  console.error('[web] instrumentation-client init failed', err)
}

export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse'
) {
  try {
    performance.mark(`nav-start-${navigationType}-${url}`)
  } catch {
    // ignore
  }
}

function reportClientError(error: unknown, source: 'error' | 'unhandledrejection') {
  // Replace with a remote sink when one is wired up.
  console.error(`[web] client ${source}`, error)
}
