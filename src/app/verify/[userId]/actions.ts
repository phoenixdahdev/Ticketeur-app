"use server"

import { resend } from "~/lib/resend";
import { from_email } from '~/lib/resend';
import { UserService } from "~/services/user-service";
import { OnboardingDeclinedEmail } from "~/lib/emails/onboarding/onboarding-declined-email";

const userService = new UserService();

export async function getUserForVerification(userId: string) {
    try {
        const user = await userService.findById(userId);
        if (!user) {
            return {
                success: false,
                error: "User not found"
            };
        }
        return {
            success: true,
            user
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get user"
        };
    }
}

export async function approveUserOnboarding(userId: string) {
    try {
        const user = await userService.findById(userId);
        if (!user) {
            return {
                success: false,
                error: "User not found"
            };
        }

        await userService.updateUser(userId, {
            is_onboarded: true,
            onboarding_status: 'approved',
            is_active: true
        });

        return {
            success: true,
            message: "User onboarding approved successfully"
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to approve user"
        };
    }
}

export async function declineUserOnboarding(userId: string, reason?: string) {
    try {
        const user = await userService.findById(userId);
        if (!user) {
            return {
                success: false,
                error: "User not found"
            };
        }

        await userService.updateUser(userId, {
            is_onboarded: false,
            onboarding_status: 'declined',
            is_active: false
        });

        // Send decline email to user
        await resend.emails.send({
            from: from_email,
            to: [user.email],
            subject: "Update on Your Ticketuer Account Verification",
            react: OnboardingDeclinedEmail({
                firstName: user.first_name || "User",
                reason: reason
            }),
        });

        return {
            success: true,
            message: "User onboarding declined and notification sent"
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to decline user"
        };
    }
}
