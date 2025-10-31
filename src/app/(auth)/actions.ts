"use server"

import { resend } from "~/lib/resend";
import { cookies } from "next/headers";
import { from_email } from '../../lib/resend';
import { NewUser } from '../../db/schema/user';
import { UserService } from "~/services/user-service";
import { OTPService } from "~/services/otp-service";
import { LoginFormType, SignupFormType } from "./schema";
import { VerificationEmail } from "~/lib/emails/verifications/verification-email";
import { OnboardingResponseEmail } from "~/lib/emails/onboarding/onboarding-response-email";
import { auth, unstable_update as update_session } from "~/auth";

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
        console.log("OTP for verification:", otp.otp);
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
    const cookie = await cookies()
    try {
        const user = await userService.findByEmail(props.email);
        if (!user) {
            return {
                success: false,
                error: "User not found",
                type: "user-not-found"
            };
        }

        if (!user.password) {
            return {
                success: false,
                error: "User created using social login",
                type: "social-login"
            };
        }
        const isValid = await userService.comparePassword(props.password, user.password as string);
        if (!isValid) {
            return {
                success: false,
                error: "Invalid password",
                type: "invalid-password"
            };
        }

        if (!user.is_verified) {
            const otp = await otpService.createOTP(user.id, "email_verification");
            await resend.emails.send({
                from: from_email,
                to: [user.email],
                subject: "Email Verification Code",
                react: VerificationEmail({ firstName: user.first_name || "User", otp: otp.otp }),
            });
            cookie.set("verify-with", user.id);
            return {
                success: false,
                error: "Account is not verified",
                type: "account-verification"
            }
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

export async function trigger_verification_for_user(userId: string) {
    const cookie = await cookies()
    try {
        const user = await userService.findById(userId);
        if (!user) {
            return {
                success: false,
                error: "User not found"
            };
        }

        if (user.is_verified) {
            return {
                success: true,
                message: "User is already verified"
            };
        }

        const otp = await otpService.createOTP(user.id, "email_verification");
        console.log("OTP for verification:", otp.otp);
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
            error: error instanceof Error ? error.message : "Failed to trigger verification"
        };
    }
}



export async function send_onboarding_response({ documents }: { documents: string[] }) {
    const admin_email = "giftobafaiye@gmail.com"


    const session = await auth();
    if (!session?.user?.id) {
        return {
            success: false,
            error: "Unauthorized - Please log in"
        };
    }

    const user_id = session.user.id;
    const user = await userService.findById(user_id);
    if (!user) {
        return {
            success: false,
            error: "User not found"
        };
    }

    try {
        await userService.updateUser(user_id, {
            registration_documents: documents,
            onboarding_status: 'pending'
        });
        const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
        const verificationUrl = `${baseUrl}/verify/${user_id}`;

        await resend.emails.send({
            from: from_email,
            to: [admin_email],
            subject: `New Onboarding Response - ${user.first_name || user.email}`,
            react: OnboardingResponseEmail({
                userName: user.first_name || user.email,
                userEmail: user.email,
                userId: user.id,
                documents: documents,
                verificationUrl: verificationUrl
            }),
        });


        await update_session({
            ...session,
            user: {
                ...session.user,
                onboarding_status: 'pending',
                registration_documents: documents
            }
        });

        return {
            success: true,
            message: "Onboarding response sent successfully"
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send onboarding response"
        };
    }

}