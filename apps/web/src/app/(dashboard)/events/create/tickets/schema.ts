import { z } from 'zod'

const ticketSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    price: z.number().min(0),
    currency: z.string().length(3),
    start: z.date(),
    end: z.date(),
    enable_sit_selection: z.boolean(),
    benefits: z.array(z.string()),
})

export type TicketType = z.infer<typeof ticketSchema>


export const createTicketSchema = z.object({
    tickets: z.array(ticketSchema).min(1, {
        message: 'At least one ticket is required.',
    }),
})

export type CreateTicketType = z.infer<typeof createTicketSchema>