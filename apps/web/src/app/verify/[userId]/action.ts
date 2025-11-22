"use server"

import { userQueries } from "@useticketeur/db"
import { tasks } from "@trigger.dev/sdk"
import { env } from "../../../../env"

export async function getUserForVerification(userId: string) {
    try {
        const user = await userQueries.findById(userId)
        if (!user) {
            return {
                success: false,
                error: "User not found"
            }
        }
        return {
            success: true,
            user
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get user"
        }
    }
}

export async function approveUserOnboarding(userId: string) {
    try {
        const user = await userQueries.findById(userId)
        if (!user) {
            return {
                success: false,
                error: "User not found"
            }
        }

        // Verify the user (admin approval)
        await userQueries.adminVerify(userId)

        // Also mark as onboarded and active
        await userQueries.update(userId, {
            is_onboarded: true,
            is_active: true
        })

        // Send approval email via jobs
        const baseUrl = env.VERCEL_URL || 'http://localhost:3000'
        await tasks.trigger('send-onboarding-accepted-email', {
            email: user.email,
            firstName: user.first_name || 'User',
            dashboardUrl: `${baseUrl}/?verified=true&userId=${userId}`,
        })

        return {
            success: true,
            message: "User onboarding approved successfully"
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to approve user"
        }
    }
}

export async function declineUserOnboarding(userId: string, reason?: string) {
    try {
        const user = await userQueries.findById(userId)
        if (!user) {
            return {
                success: false,
                error: "User not found"
            }
        }

        // Reject the verification and clear documents
        await userQueries.adminRejectVerification(userId)

        // Also mark as not onboarded and inactive
        await userQueries.update(userId, {
            is_onboarded: false,
            is_active: false
        })

        // Send decline email via jobs
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        await tasks.trigger('send-onboarding-declined-email', {
            email: user.email,
            firstName: user.first_name || 'User',
            reason: reason,
            supportUrl: `${baseUrl}/support`,
        })

        return {
            success: true,
            message: "User onboarding declined and notification sent"
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to decline user"
        }
    }
}
