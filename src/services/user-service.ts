import { eq } from 'drizzle-orm';
import { db } from '~/db/drizzle';
import { BaseService } from './base-service';
import { NewUser, User, users } from '~/db/schema/user';
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";

export class UserService extends BaseService<typeof users> {
    protected table = users;
    constructor() {
        super();
    }

    async hashPassword(password: string): Promise<string> {
        const salt = genSaltSync(10);
        return hashSync(password, salt);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return compareSync(password, hash);
    }

    async createUser(data: NewUser): Promise<User> {
        const insertData = { ...data };

        if (insertData.password) {
            insertData.password = await this.hashPassword(insertData.password);
        }

        const [user] = await db.insert(users).values(insertData).returning();
        return user;
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        return user;
    }

    async findById(id: string): Promise<User | undefined> {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, id));

        return user;
    }

    async findOrCreateSocialUser(
        providerId: string,
        data: Omit<NewUser, 'id'>
    ): Promise<User> {
        const [existing] = await db
            .select()
            .from(users)
            .where(eq(users.google_id, providerId));

        if (existing) return existing;

        const [userbyemail] = await db.select().from(users).where(eq(users.email, data.email));
        if (userbyemail) {
            await db
                .update(users)
                .set({
                    google_id: providerId,
                    is_active: true,
                    is_verified: true,
                })
                .where(eq(users.id, userbyemail.id));
            return userbyemail;
        }

        const [newUser] = await db
            .insert(users)
            .values({
                ...data,
                google_id: providerId,
                is_active: true,
                is_verified: true,
                email_verified_at: new Date(),
            })
            .returning();

        return newUser;
    }

    /**
   * Update any user field(s) by id
   */
    async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
        const updateData = { ...updates };
        if (updateData.password) {
            updateData.password = await this.hashPassword(updateData.password);
        }

        const [user] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, id))
            .returning();

        return user;
    }

}
