import { db } from '../drizzle';
import { eq, and, desc } from 'drizzle-orm';
import { hash, compare } from 'bcrypt-ts';
import { users, type NewUser, type User, type UserType } from '../schema/user';

const SALT_ROUNDS = 10;

export const userQueries = {
    /**
     * Create a new user with hashed password
     */
    async create(data: NewUser): Promise<User> {
        const userData = { ...data };

        // Hash password if provided
        if (userData.password) {
            userData.password = await hash(userData.password, SALT_ROUNDS);
        }

        const [user] = await db.insert(users).values(userData).returning();
        if (!user) throw new Error('Failed to create user');
        return user;
    },

    /**
     * Find user by ID
     */
    async findById(id: string): Promise<User | undefined> {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
    },

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | undefined> {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
    },

    /**
     * Find user by username
     */
    async findByUsername(username: string): Promise<User | undefined> {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user;
    },

    /**
     * Find user by email or create new user (for social authentication)
     */
    async findByEmailOrCreate(data: NewUser): Promise<User> {
        const existingUser = await this.findByEmail(data.email);

        if (existingUser) {
            return existingUser;
        }

        // Create new user without hashing password for social auth
        const [user] = await db.insert(users).values(data).returning();
        if (!user) throw new Error('Failed to create user');
        return user;
    },

    /**
     * Verify user password
     */
    async verifyPassword(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email);

        if (!user || !user.password) {
            return null;
        }

        const isValid = await compare(password, user.password);
        return isValid ? user : null;
    },

    /**
     * Update user password
     */
    async updatePassword(userId: string, newPassword: string): Promise<User | undefined> {
        const hashedPassword = await hash(newPassword, SALT_ROUNDS);

        const [user] = await db
            .update(users)
            .set({
                password: hashedPassword,
                updated_at: new Date()
            })
            .where(eq(users.id, userId))
            .returning();

        return user;
    },

    /**
     * Update user
     */
    async update(userId: string, data: Partial<NewUser>): Promise<User | undefined> {
        const updateData = { ...data, updated_at: new Date() };

        // Hash password if being updated
        if (updateData.password) {
            updateData.password = await hash(updateData.password, SALT_ROUNDS);
        }

        const [user] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId))
            .returning();

        return user;
    },

    /**
     * Mark email as verified
     */
    async verifyEmail(userId: string): Promise<User | undefined> {
        const [user] = await db
            .update(users)
            .set({
                email_verified_at: new Date(),
                updated_at: new Date()
            })
            .where(eq(users.id, userId))
            .returning();

        return user;
    },

    /**
     * Submit documents for admin verification (event organizer verification)
     */
    async submitVerificationDocuments(
        userId: string,
        documents: string[],
        validId?: string
    ): Promise<User | undefined> {
        const [user] = await db
            .update(users)
            .set({
                registration_documents: documents,
                valid_id: validId,
                updated_at: new Date()
            })
            .where(eq(users.id, userId))
            .returning();

        return user;
    },

    /**
     * Admin verifies user (allows user to create events)
     */
    async adminVerify(userId: string): Promise<User | undefined> {
        const [user] = await db
            .update(users)
            .set({
                is_verified: true,
                updated_at: new Date()
            })
            .where(eq(users.id, userId))
            .returning();

        return user;
    },

    /**
     * Admin rejects user verification
     */
    async adminRejectVerification(userId: string): Promise<User | undefined> {
        const [user] = await db
            .update(users)
            .set({
                is_verified: false,
                registration_documents: null,
                valid_id: null,
                updated_at: new Date()
            })
            .where(eq(users.id, userId))
            .returning();

        return user;
    },

    /**
     * Find users pending admin verification (have documents but not verified)
     */
    async findPendingVerification(): Promise<User[]> {
        return db
            .select()
            .from(users)
            .where(
                and(
                    eq(users.is_verified, false),
                    eq(users.is_active, true)
                )
            )
            .orderBy(desc(users.created_at));
    },

    /**
     * Update last login timestamp
     */
    async updateLastLogin(userId: string): Promise<User | undefined> {
        const [user] = await db
            .update(users)
            .set({
                last_login_at: new Date(),
                updated_at: new Date()
            })
            .where(eq(users.id, userId))
            .returning();

        return user;
    },

    /**
     * Mark user as onboarded
     */
    async markAsOnboarded(userId: string): Promise<User | undefined> {
        const [user] = await db
            .update(users)
            .set({
                is_onboarded: true,
                updated_at: new Date()
            })
            .where(eq(users.id, userId))
            .returning();

        return user;
    },

    /**
     * Activate/Deactivate user
     */
    async setActive(userId: string, isActive: boolean): Promise<User | undefined> {
        const [user] = await db
            .update(users)
            .set({
                is_active: isActive,
                updated_at: new Date()
            })
            .where(eq(users.id, userId))
            .returning();

        return user;
    },

    /**
     * Delete user
     */
    async delete(userId: string): Promise<void> {
        await db.delete(users).where(eq(users.id, userId));
    },

    /**
     * Get all users (with optional filters)
     */
    async findAll(filters?: {
        isActive?: boolean;
        isVerified?: boolean;
        userType?: UserType;
    }): Promise<User[]> {
        let query = db.select().from(users);

        if (filters) {
            const conditions = [];

            if (filters.isActive !== undefined) {
                conditions.push(eq(users.is_active, filters.isActive));
            }
            if (filters.isVerified !== undefined) {
                conditions.push(eq(users.is_verified, filters.isVerified));
            }
            if (filters.userType) {
                conditions.push(eq(users.user_type, filters.userType));
            }

            if (conditions.length > 0) {
                query = query.where(and(...conditions)) as typeof query;
            }
        }

        return await query;
    },
};
