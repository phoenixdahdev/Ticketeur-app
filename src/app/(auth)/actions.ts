"use server"

import { resend } from "~/lib/resend";
import { SignupFormType } from "./schema";
import { from_email } from '../../lib/resend';
import { UserService } from "~/services/user-service";
import { OTPService } from "~/services/otp-service";
import { VerificationEmail } from "~/lib/emails/verifications/verification-email";
import { cookies } from "next/headers";

const userService = new UserService();
const otpService = new OTPService()

export async function signup(props: SignupFormType) {
    const cookie = await cookies()
    try {
        const existingUser = await userService.findByEmail(props.email);
        if (existingUser) {
            return {
                success: false,
                error: "User with this email already exists"
            };
        }
        const user = await userService.createUser(props);
        const otp = await otpService.createOTP(user.id, "email_verification");
        await resend.emails.send({
            from: from_email,
            to: [props.email],
            subject: "Email Verification Code",
            react: VerificationEmail({ firstName: user.first_name || "User", otp: otp.otp }),
        })
        cookie.set("verify-with", user.id)
        return {
            success: true,
            user
        };
    } catch (error) {

        console.error("Signup error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create user"
        };
    }
}


export async function verifyotp(otp: string) {
    const cookie = await cookies()
    try {
        const userId = cookie.get("verify-with")?.value;
        if (!userId) {
            return {
                success: false,
                error: "User not found"
            };
        }
        const user = await userService.findById(userId);
        if (!user) {
            return {
                success: false,
                error: "User not found"
            };
        }
        if (user.is_verified) {
            return {
                success: false,
                error: "User is already verified"
            };
        }
        const isValid = await otpService.verifyOTP(userId, otp, "email_verification");
        if (!isValid) {
            return {
                success: false,
                error: "Invalid OTP"
            };
        }
        cookie.delete("verify-with");
        return {
            success: true
        };
    } catch (error) {
        console.error("OTP verification error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to verify OTP"
        };
    }
}


export async function resendverificationotp() {
    const cookie = await cookies()
    try {
        const userId = cookie.get("verify-with")?.value;
        if (!userId) {
            return {
                success: false,
                error: "User not found"
            };
        }
        const user = await userService.findById(userId);
        if (!user) {
            return {
                success: false,
                error: "User not found"
            };
        }
        const otp = await otpService.createOTP(user.id, "email_verification");
        await resend.emails.send({
            from: from_email,
            to: [user.email],
            subject: "Email Verification Code",
            react: VerificationEmail({ firstName: user.first_name || "User", otp: otp.otp }),
        });
        cookie.set("verify-with", user.id);
        return {
            success: true
        };
    } catch (error) {
        console.error("Resend OTP error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to resend OTP"
        };
    }

}