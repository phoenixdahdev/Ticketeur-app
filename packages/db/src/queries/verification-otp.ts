import { db } from '../drizzle';
import { eq, and, gt, lt } from 'drizzle-orm';
import { verification_otps, type NewVerificationOTP, type VerificationOTP } from '../schema/user';

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export const verificationOtpQueries = {
    /**
     * Create a new OTP for verification
     */
    async create(data: Omit<NewVerificationOTP, 'expires_at'>): Promise<VerificationOTP> {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);

        const [otp] = await db
            .insert(verification_otps)
            .values({
                ...data,
                expires_at: expiresAt,
            })
            .returning();

        if (!otp) throw new Error('Failed to create OTP');
        return otp;
    },

    /**
     * Find OTP by user ID and type
     */
    async findByUserIdAndType(userId: string, type: string): Promise<VerificationOTP | undefined> {
        const [otp] = await db
            .select()
            .from(verification_otps)
            .where(
                and(
                    eq(verification_otps.user_id, userId),
                    eq(verification_otps.type, type),
                    gt(verification_otps.expires_at, new Date())
                )
            )
            .orderBy(verification_otps.created_at);

        return otp;
    },

    /**
     * Verify OTP
     * @throws Error with specific message for different failure cases
     */
    async verify(userId: string, otp: string, type: string): Promise<boolean> {
        const otpRecord = await this.findByUserIdAndType(userId, type);

        if (!otpRecord) {
            throw new Error('OTP_NOT_FOUND');
        }

        // Check if OTP has expired
        if (new Date() > otpRecord.expires_at) {
            await this.delete(otpRecord.id);
            throw new Error('OTP_EXPIRED');
        }

        // Check if max attempts exceeded
        if (otpRecord.attempts && otpRecord.attempts >= MAX_ATTEMPTS) {
            await this.delete(otpRecord.id);
            throw new Error('OTP_MAX_ATTEMPTS_EXCEEDED');
        }

        // Check if OTP matches
        if (otpRecord.otp !== otp) {
            // Increment attempts
            const updatedAttempts = (otpRecord.attempts || 0) + 1;
            await db
                .update(verification_otps)
                .set({
                    attempts: updatedAttempts,
                    updated_at: new Date(),
                })
                .where(eq(verification_otps.id, otpRecord.id));

            const remainingAttempts = MAX_ATTEMPTS - updatedAttempts;
            throw new Error(`OTP_INVALID:${remainingAttempts}`);
        }

        // OTP is valid, delete it
        await this.delete(otpRecord.id);
        return true;
    },

    /**
     * Delete OTP by ID
     */
    async delete(id: string): Promise<void> {
        await db.delete(verification_otps).where(eq(verification_otps.id, id));
    },

    /**
     * Delete all OTPs for a user and type
     */
    async deleteByUserIdAndType(userId: string, type: string): Promise<void> {
        await db
            .delete(verification_otps)
            .where(
                and(
                    eq(verification_otps.user_id, userId),
                    eq(verification_otps.type, type)
                )
            );
    },

    /**
     * Delete expired OTPs (cleanup)
     */
    async deleteExpired(): Promise<void> {
        await db
            .delete(verification_otps)
            .where(lt(verification_otps.expires_at, new Date()));
    },

    /**
     * Generate a random 6-digit OTP
     */
    generateOTP(): string {
        const digits = "123456789";
        let otp = "";

        for (let i = 0; i < 6; i++) {
            const index = Math.floor(Math.random() * digits.length);
            otp += digits[index];
        }

        return otp;
    }

};
