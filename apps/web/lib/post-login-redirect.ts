export function getPostLoginPath(role: string | null | undefined): string {
  switch (role) {
    case 'organizer':
      return '/org/dashboard'
    case 'vendor':
      return '/vendor/dashboard'
    case 'admin':
      // The admin dashboard is a separate app (its own deploy). There is no
      // admin area in the web app, so send admins to the public home instead
      // of a route that 404s here.
      return '/'
    default:
      return '/'
  }
}
