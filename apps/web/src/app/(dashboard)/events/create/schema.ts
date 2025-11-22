import z from 'zod'

export const createEventSchema = z
    .object({
        title: z.string().min(1, { message: 'Title is required.' }),
        description: z.string().min(1, { message: 'Description is required.' }),
        image: z.string({ message: 'Please provide a valid image URL.' }).optional(),
        event_type: z
            .string()
            .max(20, { message: 'Event type must be 20 characters or less.' }),
        event_start_date: z.date({}),
        event_end_date: z.date({}),
    })
    .refine((data) => data.event_end_date >= data.event_start_date, {
        message: 'Event end date must be after the start date.',
        path: ['event_end_date'],
    })

export type CreateEventType = z.infer<typeof createEventSchema>