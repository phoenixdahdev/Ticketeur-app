export function getPostLoginPath(role: string | null | undefined): string {
  switch (role) {
    case 'organizer':
      return '/org/dashboard'
    case 'vendor':
      return '/vendor/dashboard'
    case 'admin':
      return '/admin/dashboard'
    default:
      return '/'
  }
}
