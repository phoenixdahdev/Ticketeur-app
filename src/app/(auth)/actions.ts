"use server"

import { resend } from "~/lib/resend";
import { cookies } from "next/headers";
import { from_email } from '../../lib/resend';
import { NewUser } from '../../db/schema/user';
import { UserService } from "~/services/user-service";
import { OTPService } from "~/services/otp-service";
import { LoginFormType, SignupFormType } from "./schema";
import { VerificationEmail } from "~/lib/emails/verifications/verification-email";

const otpService = new OTPService()
const userService = new UserService();

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
        const updatedUser = await userService.updateUser(userId, { is_verified: true, is_active: true, email_verified_at: new Date() });
        return {
            success: true,
            user: updatedUser
        };
    } catch (error) {
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
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to resend OTP"
        };
    }
}


export const login = async (props: LoginFormType) => {
    try {
        const user = await userService.findByEmail(props.email);
        if (!user) {
            return {
                success: false,
                error: "User not found"
            };
        }

        if (!user.password) {
            return {
                success: false,
                error: "User created using social login"
            };
        }
        const isValid = await userService.comparePassword(props.password, user.password as string);
        if (!isValid) {
            return {
                success: false,
                error: "Invalid password"
            };
        }

        if (!user.is_verified) {
            return {
                success: false,
                error: "Account is not verified"
            }
        }
        return {
            success: true,
            user
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to login"
        };
    }
};


export async function get_user_by_email(email: string) {
    try {
        const user = await userService.findByEmail(email);
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

export async function google_login(props: { email: string, name: string, providerId: string } & Partial<NewUser>) {
    try {
        const user = await userService.findOrCreateSocialUser(props.providerId, {
            email: props.email,
            first_name: props.name,
            user_type: "normal",
        })
        return {
            success: true,
            user
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get user"
        };
    }
}
