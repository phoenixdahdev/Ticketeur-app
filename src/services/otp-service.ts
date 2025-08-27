import { db } from '~/db/drizzle';
import { eq, and, gte } from 'drizzle-orm';
import { BaseService } from './base-service';
import { NewVerificationOTP, VerificationOTP, verification_otps } from '~/db/schema/user';

export type OTPType = 'email_verification' | 'password_reset' | 'login_verification' | 'account_activation';

export class OTPService extends BaseService<typeof verification_otps> {
    protected table = verification_otps;

    constructor() {
        super();
    }

    /**
     * Generate a random 6-digit OTP
     */
    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Create a new OTP for a user
     */
    async createOTP(
        userId: string,
        type: OTPType,
        expiryMinutes: number = 10
    ): Promise<VerificationOTP> {
        await this.deleteExistingOTP(userId, type);
        const otp = this.generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

        const insertData: NewVerificationOTP = {
            user_id: userId,
            otp,
            type,
            expires_at: expiresAt,
            attempts: 0
        };

        const [newOTP] = await db
            .insert(verification_otps)
            .values(insertData)
            .returning();

        return newOTP;
    }

    /**
     * Verify an OTP
     */
    async verifyOTP(
        userId: string,
        otp: string,
        type: OTPType
    ): Promise<{ success: boolean; message: string; otpRecord?: VerificationOTP }> {
        const [otpRecord] = await db
            .select()
            .from(verification_otps)
            .where(
                and(
                    eq(verification_otps.user_id, userId),
                    eq(verification_otps.type, type),
                    gte(verification_otps.expires_at, new Date())
                )
            );

        if (!otpRecord) {
            return {
                success: false,
                message: "OTP not found or has expired"
            };
        }

        await db
            .update(verification_otps)
            .set({
                attempts: (otpRecord.attempts ?? 0) + 1,
                updated_at: new Date()
            })
            .where(eq(verification_otps.id, otpRecord.id));

        if ((otpRecord.attempts ?? 0) >= 5) {
            await this.deleteOTP(otpRecord.id);
            return {
                success: false,
                message: "Too many failed attempts. Please request a new OTP."
            };
        }
        if (otpRecord.otp !== otp) {
            return {
                success: false,
                message: "Invalid OTP"
            };
        }
        await this.deleteOTP(otpRecord.id);

        return {
            success: true,
            message: "OTP verified successfully",
            otpRecord
        };
    }

    /**
     * Find valid OTP by user ID and type
     */
    async findValidOTP(userId: string, type: OTPType): Promise<VerificationOTP | undefined> {
        const [otpRecord] = await db
            .select()
            .from(verification_otps)
            .where(
                and(
                    eq(verification_otps.user_id, userId),
                    eq(verification_otps.type, type),
                    gte(verification_otps.expires_at, new Date())
                )
            );

        return otpRecord;
    }

    /**
     * Delete an OTP by ID
     */
    async deleteOTP(otpId: string): Promise<boolean> {
        const result = await db
            .delete(verification_otps)
            .where(eq(verification_otps.id, otpId));

        return result.rowCount > 0;
    }

    /**
     * Delete existing OTP for user and type
     */
    async deleteExistingOTP(userId: string, type: OTPType): Promise<void> {
        await db
            .delete(verification_otps)
            .where(
                and(
                    eq(verification_otps.user_id, userId),
                    eq(verification_otps.type, type)
                )
            );
    }

    /**
     * Delete expired OTPs (cleanup function)
     */
    async deleteExpiredOTPs(): Promise<number> {
        const result = await db
            .delete(verification_otps)
            .where(
                gte(verification_otps.expires_at, new Date())
            );

        return result.rowCount;
    }

    /**
     * Get OTP attempts count
     */
    async getOTPAttempts(userId: string, type: OTPType): Promise<number> {
        const otpRecord = await this.findValidOTP(userId, type);
        return otpRecord?.attempts || 0;
    }

    /**
     * Check if user can request new OTP (rate limiting)
     */
    async canRequestNewOTP(
        userId: string,
        type: OTPType,
        cooldownMinutes: number = 1
    ): Promise<{ canRequest: boolean; timeLeft?: number }> {
        const [recentOTP] = await db
            .select()
            .from(verification_otps)
            .where(
                and(
                    eq(verification_otps.user_id, userId),
                    eq(verification_otps.type, type)
                )
            )
            .orderBy(verification_otps.created_at)
            .limit(1);

        if (!recentOTP) {
            return { canRequest: true };
        }

        const cooldownMs = cooldownMinutes * 60 * 1000;
        const timeSinceCreation = Date.now() - recentOTP.created_at.getTime();

        if (timeSinceCreation < cooldownMs) {
            const timeLeft = Math.ceil((cooldownMs - timeSinceCreation) / 1000);
            return {
                canRequest: false,
                timeLeft
            };
        }

        return { canRequest: true };
    }

    /**
     * Batch delete OTPs for a user (useful when user is deleted)
     */
    async deleteUserOTPs(userId: string): Promise<number> {
        const result = await db
            .delete(verification_otps)
            .where(eq(verification_otps.user_id, userId));

        return result.rowCount;
    }
}