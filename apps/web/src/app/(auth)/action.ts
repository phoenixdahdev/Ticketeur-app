"use server"
import { cookies } from 'next/headers';
import { tasks } from "@trigger.dev/sdk"
import { auth, unstable_update } from '@/auth';
import { SignupFormType, type LoginFormType, } from './schema';
import { type NewUser, userQueries, verificationOtpQueries } from '@useticketeur/db';


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
            await tasks.trigger("send-verification-email", {
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
        const isPasswordValid = await userQueries.verifyPassword(user.email, props.password);
        await userQueries.updateLastLogin(user.id)
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


export async function signup(props: SignupFormType) {
    const cookie = await cookies()
    try {
        const existingUser = await userQueries.findByEmail(props.email);
        if (existingUser) {
            return {
                success: false,
                error: "User with this email already exists"
            };
        }

        const newUser = await userQueries.create({
            first_name: props.first_name,
            last_name: props.last_name,
            email: props.email,
            password: props.password,
        });

        const otp = await verificationOtpQueries.create({
            user_id: newUser.id,
            type: "email-verification",
            otp: verificationOtpQueries.generateOTP(),
        })
        await tasks.trigger("send-verification-email", {
            email: newUser.email,
            otp: otp.otp,
            name: newUser.first_name,
        })
        cookie.set("verify-with", newUser.id);
        return {
            success: true,
            user: newUser
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to login",
            type: "general"
        };
    }
};


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
        const user = await userQueries.findById(userId);
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
        const isValid = await verificationOtpQueries.verify(userId, otp, "email-verification");
        if (!isValid) {
            return {
                success: false,
                error: "Invalid OTP"
            };
        }
        cookie.delete("verify-with");
        const updatedUser = await userQueries.verifyEmail(userId);
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
        const user = await userQueries.findById(userId);
        if (!user) {
            return {
                success: false,
                error: "User not found"
            };
        }

        if (user.email_verified_at) {
            return {
                success: false,
                error: "User is already verified"
            };
        }

        const otp = await verificationOtpQueries.create({
            user_id: user.id,
            type: "email-verification",
            otp: verificationOtpQueries.generateOTP(),
        })
        await tasks.trigger("send-verification-email", {
            email: user.email,
            otp: otp.otp,
            name: user.first_name,
        })
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


export async function google_login(props: { email: string, name: string } & Partial<NewUser>) {
    try {
        const user = await userQueries.findByEmailOrCreate({
            email: props.email,
            first_name: props.name,
            user_type: "normal",
        })
        await userQueries.updateLastLogin(user.id)
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

export async function get_user_by_email(email: string) {
    try {

        const user = await userQueries.findByEmail(email);
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
            error: error instanceof Error ? error.message : "Failed to login",
            type: "general"
        };
    }
};



export async function trigger_verification_for_user(userId: string) {
    const cookie = await cookies()
    try {
        const user = await userQueries.findById(userId);
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

        const otp = await verificationOtpQueries.create({
            user_id: user.id,
            type: "email-verification",
            otp: verificationOtpQueries.generateOTP(),
        })
        await tasks.trigger("send-verification-email", {
            email: user.email,
            otp: otp.otp,
            name: user.first_name,
        })
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


// TODO: update this to change when the admin ui is ready
const ADMIN_EMAIL = "giftobafaiye@gmail.com"

export async function send_onboarding_response({ documents }: { documents: string[] }) {
    const session = await auth();
    if (!session?.user?.id) {
        return {
            success: false,
            error: "Unauthorized - Please log in"
        };
    }

    const user_id = session.user.id;
    const user = await userQueries.findById(user_id);
    if (!user) {
        return {
            success: false,
            error: "User not found"
        };
    }
    try {
        await userQueries.submitVerificationDocuments(user_id, documents)
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const verificationUrl = `${baseUrl}/verify/${user_id}`;
        await tasks.trigger("send-onboarding-submitted-email", {
            email: user.email,
            firstName: user.first_name,
        })
        await tasks.trigger("send-onboarding-response-admin-email", {
            adminEmail: ADMIN_EMAIL,
            userName: `${user.first_name} ${user.last_name || ''}`.trim(),
            userEmail: user.email,
            userId: user_id,
            documents,
            verificationUrl,
        })
        await update_session()
        return {
            success: true,
            message: "Onboarding documents submitted successfully"
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send onboarding response"
        };
    }
}


export async function get_use_by_id(id: string) {
    const user = await userQueries.findById(id)
    return user
}

export async function update_session() {
    await unstable_update({})
}

export async function onboard_user() {
    const session = await auth()
    await userQueries.markAsOnboarded(session?.user.id!)
    await update_session()
    return
}