import z from "zod";

export const signupSchema = z
    .object({
        email: z.email({
            message: 'Please enter a valid email address.',
        }),
        password: z.string().min(8, {
            message: 'Password must be at least 8 characters.',
        }),
        confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ['confirm_password'],
    })

export const otpschema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

export type SignupFormType = z.infer<typeof signupSchema>
export type OtpFormType = z.infer<typeof otpschema>