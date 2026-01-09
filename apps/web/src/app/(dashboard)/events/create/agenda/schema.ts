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
  location_type: z.enum(['physical', 'online', 'hybrid']),
  address: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  meeting_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  venue_type: z
    .string()
    .max(100, { message: 'Venue type must be 100 characters or less.' })
    .optional()
    .or(z.literal('')),
  sessions: z.array(eventSessionSchema),
}).refine(
  (data) => {
    if (data.location_type === 'physical' || data.location_type === 'hybrid') {
      return (
        !!data.venue_type &&
        !!data.address &&
        !!data.country &&
        !!data.state &&
        !!data.city
      )
    }
    return true
  },
  {
    message: 'Venue name, address, country, state, and city are required',
    path: ['venue_type'],
  }
).refine(
  (data) => {
    if (data.location_type === 'online' || data.location_type === 'hybrid') {
      if (data.meeting_url === undefined || data.meeting_url === '') return true // Optional, but if present must be URL (handled by regex above)
      // Actually user wanted optional field for online URL to join
    }
    return true
  },
  {
    message: 'Meeting URL is required',
    path: ['meeting_url'],
  }
)

export type AddAgendaType = z.infer<typeof addAgendaSchema>