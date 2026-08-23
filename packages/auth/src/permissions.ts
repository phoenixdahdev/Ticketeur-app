import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access'

const statement = {
  ...defaultStatements,
  event: ['create', 'update', 'delete', 'view'],
  booth: ['create', 'update', 'delete', 'view'],
  registration: ['register', 'unregister', 'manage'],
} as const

export const ac = createAccessControl(statement)

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

export const admin = ac.newRole({
  ...adminAc.statements,
  event: ['create', 'update', 'delete', 'view'],
  booth: ['create', 'update', 'delete', 'view'],
  registration: ['register', 'unregister', 'manage'],
})
