import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements } from 'better-auth/plugins/admin/access'

// Resource statements — the actions our roles can perform on each resource.
// Merged with Better Auth's default admin statements (user, session).
const statement = {
  ...defaultStatements,
  event: ['create', 'update', 'delete', 'view'],
  booth: ['create', 'update', 'delete', 'view'],
  registration: ['register', 'unregister', 'manage'],
} as const

export const ac = createAccessControl(statement)

// ─── Business roles ─────────────────────────────────────────────────────────

export const attendee = ac.newRole({
  event: ['view'],
  registration: ['register', 'unregister'],
})

export const organizer = ac.newRole({
  event: ['create', 'update', 'delete', 'view'],
  registration: ['manage'],
})

export const vendor = ac.newRole({
  booth: ['create', 'update', 'delete', 'view'],
  event: ['view'],
})

// Platform admin uses Better Auth's built-in "admin" role — no custom definition
// needed. It gets default user/session permissions and is listed in `adminRoles`
// on the plugin config.
