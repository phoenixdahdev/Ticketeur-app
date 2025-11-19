"use server"
import { cookies } from 'next/headers';
import { tasks } from "@trigger.dev/sdk"
import { type LoginFormType, } from './schema';
import { userQueries, verificationOtpQueries } from '@useticketeur/db';


export async function login(props: LoginFormType) {
    const cookie = await cookies()

    try {
        const user = await userQueries.findByEmail(props.email);
        if (!user) {
            return {
                success: false,
                error: "No account found with this email address.",
                type: "email"
            };
        }
        if (!user.password) {
            return {
                success: false,
                error: "User created using social login",
                type: "social-login"
            };
        }

        if (!user.email_verified_at) {
            const otp = await verificationOtpQueries.create({
                user_id: user.id,
                type: "email-verification",
                otp: verificationOtpQueries.generateOTP(),
            })
            await tasks.trigger("send-email-verification-otp", {
                email: user.email,
                otp: otp.otp,
                name: user.first_name,
            })
            cookie.set("verify-with", user.id);
            return {
                success: false,
                error: "Email address not verified.",
                type: "email-verification"
            };
        }
        const isPasswordValid = await userQueries.verifyPassword(user.id, props.password);
        if (!isPasswordValid) {
            return {
                success: false,
                error: "Incorrect password. Please try again.",
                type: "password"
            };
        }
        return {
            success: true,
            user
        };


    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to login",
            type: "general"
        };
    }
};