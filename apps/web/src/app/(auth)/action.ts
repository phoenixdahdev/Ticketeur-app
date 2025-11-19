"use server"
import { cookies } from 'next/headers';
import { tasks } from "@trigger.dev/sdk"
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
        await tasks.trigger("send-email-verification-otp", {
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
        const isValid = await verificationOtpQueries.verify(userId, otp, "email_verification");
        if (!isValid) {
            return {
                success: false,
                error: "Invalid OTP"
            };
        }
        cookie.delete("verify-with");
        const updatedUser = await userQueries.update(userId, { is_verified: true, is_active: true, email_verified_at: new Date() });
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
        await tasks.trigger("send-email-verification-otp", {
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
        await tasks.trigger("send-email-verification-otp", {
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