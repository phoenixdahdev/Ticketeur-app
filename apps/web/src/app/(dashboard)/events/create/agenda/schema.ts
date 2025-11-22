import z from 'zod'

export const eventSessionSchema = z
  .object({
    title: z
      .string()
      .max(100, { message: 'Title cannot exceed 100 characters.' })
      .optional()
      .or(z.literal('')),
    track: z
      .string()
      .max(100, { message: 'Track cannot exceed 100 characters.' })
      .optional()
      .or(z.literal('')),
    start: z.date().optional().nullable(),
    end: z.date().optional().nullable(),
    speaker_name: z
      .string()
      .max(100, { message: 'Speaker name cannot exceed 100 characters.' })
      .optional()
      .nullable(),
    speaker_image: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      // Only validate end >= start if both are provided
      if (data.start && data.end) {
        return data.end >= data.start
      }
      return true
    },
    {
      message: 'Session end date must be after the start date.',
      path: ['end'],
    }
  )

export type EventSessionType = z.infer<typeof eventSessionSchema>

export const addAgendaSchema = z.object({
  address: z.string().optional().or(z.literal('')),
  venue_type: z
    .string()
    .max(100, { message: 'Venue type must be 100 characters or less.' })
    .optional()
    .or(z.literal('')),
  sessions: z.array(eventSessionSchema).optional().default([]),
})

export type AddAgendaType = z.infer<typeof addAgendaSchema>