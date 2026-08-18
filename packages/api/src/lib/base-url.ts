// Single source of truth for the app's own base URL, used to build absolute
// links (checkout redirect, ticket URLs, OG metadata, webhook callbacks).
//
// Precedence: the explicit public URL wins, then the auth URL, then a localhost
// fallback for dev. This resolves the current app's origin — server code that
// needs another app's URL (e.g. admin emailing links to the public site) must
// not use this.
export function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    'http://localhost:3000'
  )
}
