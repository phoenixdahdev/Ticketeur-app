import { z } from "zod"

export const WaitlistJoinedPayloadSchema = z.object({
    email: z.email(),
    name: z.string(),
})