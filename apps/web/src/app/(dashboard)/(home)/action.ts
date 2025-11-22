"use server"

import { auth } from "@/auth"
import { eventQueries } from "@useticketeur/db"

export async function get_my_events() {
    "use cache: private"
    const session = await auth()
    try {
        const events = await eventQueries.findAllUserEvents(session?.user.id!)

        return {
            success: false,
            events
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send onboarding response"
        };
    }
}