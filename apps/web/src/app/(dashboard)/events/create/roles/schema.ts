import { z } from 'zod'

const roleSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.email({
        message: 'Please enter a valid email address.',
    }),
    role: z.string(),
    permission: z.string(),
    white_label: z.boolean(),
})


export type RoleType = z.infer<typeof roleSchema>


export const createRoleSchema = z.object({
    roles: z.array(roleSchema).min(1, {
        message: 'At least one role is required.',
    }),
})

export type CreateRoleType = z.infer<typeof createRoleSchema>