"use server"

import { resend } from "~/lib/resend";
import { SignupFormType } from "./schema";
import { from_email } from '../../lib/resend';
import { UserService } from "~/services/user-service";
import { OTPService } from "~/services/otp-service";
import { VerificationEmail } from "~/lib/emails/verifications/verification-email";

const userService = new UserService();
const otpService = new OTPService()

export async function signup(props: SignupFormType) {
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