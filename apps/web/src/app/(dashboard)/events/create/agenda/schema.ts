import z from 'zod'

export const eventSessionSchema = z
    .object({
        title: z
            .string()
            .min(1, { message: 'Title is required.' })
            .max(100, { message: 'Title cannot exceed 100 characters.' }),
        track: z
            .string()
            .min(1, { message: 'Track is required.' })
            .max(100, { message: 'Track cannot exceed 100 characters.' }),
        start: z.date({}),
        end: z.date({}),
        speaker_name: z
            .string()
            .max(100, { message: 'Speaker name cannot exceed 100 characters.' })
            .optional()
            .nullable(),
        speaker_image: z.string().optional().nullable(),
    })
    .refine((data) => data.end >= data.start, {
        message: 'Session end date must be after the start date.',
        path: ['start'],
    })

export type EventSessionType = z.infer<typeof eventSessionSchema>

export const addAgendaSchema = z.object({
    address: z.string().min(1, { message: 'Address is required.' }),
    venue_type: z
        .string()
        .max(20, { message: 'Venue type must be 20 characters or less.' }),
    sessions: z.array(eventSessionSchema).min(1, {
        message: 'At least one session is required.',
    }),
})

export type AddAgendaType = z.infer<typeof addAgendaSchema>