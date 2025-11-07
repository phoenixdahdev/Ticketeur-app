module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/lib/utils.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "delay",
    ()=>delay,
    "inDevEnvironment",
    ()=>inDevEnvironment,
    "returnError",
    ()=>returnError
]);
(()=>{
    const e = new Error("Cannot find module 'clsx'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'tailwind-merge'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'axios'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
function cn(...inputs) {
    return twMerge(clsx(inputs));
}
function returnError(error) {
    console.error(error);
    if (axios.isAxiosError(error)) return error.response?.data?.message ?? 'An error occurred';
    if (error instanceof Error) return error.message;
    return 'An unknown error occurred';
}
const inDevEnvironment = !!process && ("TURBOPACK compile-time value", "development") === 'development';
function delay(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
}),
"[project]/src/lib/resend.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "from_email",
    ()=>from_email,
    "resend",
    ()=>resend
]);
(()=>{
    const e = new Error("Cannot find module 'resend'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
const resend = new Resend(process.env.RESEND_API_KEY);
const from_email = process.env.AUTH_EMAIL;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/db/schema/base-table.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseEntity",
    ()=>BaseEntity,
    "baseTable",
    ()=>baseTable,
    "createBaseTable",
    ()=>createBaseTable
]);
(()=>{
    const e = new Error("Cannot find module 'drizzle-orm/pg-core'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
class BaseEntity {
    id;
    created_at;
    updated_at;
    deleted_at;
}
function createBaseTable(tableName, columns) {
    return pgTable(tableName, {
        id: uuid('id').defaultRandom().primaryKey(),
        created_at: timestamp('created_at').defaultNow().notNull(),
        updated_at: timestamp('updated_at').defaultNow().notNull(),
        deleted_at: timestamp('deleted_at'),
        ...columns
    });
}
const baseTable = createBaseTable('base', {});
}),
"[project]/src/db/schema/user.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "userTypes",
    ()=>userTypes,
    "users",
    ()=>users,
    "verification_otps",
    ()=>verification_otps
]);
(()=>{
    const e = new Error("Cannot find module 'drizzle-orm/pg-core'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$base$2d$table$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/base-table.ts [middleware] (ecmascript)");
;
;
const userTypes = [
    'admin',
    'normal'
];
const users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$base$2d$table$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["createBaseTable"])('users', {
    email: varchar('email', {
        length: 255
    }).notNull().unique(),
    username: varchar('username', {
        length: 50
    }).unique(),
    first_name: varchar('first_name', {
        length: 100
    }),
    last_name: varchar('last_name', {
        length: 100
    }),
    user_type: varchar('user_type', {
        length: 20
    }).notNull().default('normal'),
    password: varchar('password', {
        length: 255
    }),
    avatar: text('avatar'),
    registration_documents: jsonb('registration_documents').$type(),
    valid_id: varchar('valid_id', {
        length: 500
    }),
    is_active: boolean('is_active').default(true),
    is_verified: boolean('is_verified').default(false),
    is_onboarded: boolean('is_onboarded').default(false),
    onboarding_status: varchar('onboarding_status', {
        length: 20
    }).default('pending'),
    google_id: varchar('google_id', {
        length: 255
    }),
    last_login_at: timestamp('last_login_at'),
    email_verified_at: timestamp('email_verified_at')
});
const verification_otps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$base$2d$table$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["createBaseTable"])('verification_otps', {
    user_id: uuid('user_id').references(()=>users.id, {
        onDelete: 'cascade'
    }).notNull(),
    otp: varchar('otp', {
        length: 6
    }).notNull(),
    type: varchar('type', {
        length: 50
    }).notNull(),
    expires_at: timestamp('expires_at').notNull(),
    attempts: integer('attempts').default(0)
});
}),
"[project]/src/db/schema/index.ts [middleware] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/user.ts [middleware] (ecmascript)");
;
}),
"[project]/src/db/schema/index.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "userTypes",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["userTypes"],
    "users",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"],
    "verification_otps",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/db/schema/index.ts [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/user.ts [middleware] (ecmascript)");
}),
"[project]/src/db/drizzle.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/db/schema/index.ts [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/index.ts [middleware] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'drizzle-orm/neon-http'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@neondatabase/serverless'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, {
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__
});
}),
"[project]/src/services/base-service.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
__turbopack_context__.s([
    "BaseService",
    ()=>BaseService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/drizzle.ts [middleware] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'drizzle-orm'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
class BaseService {
    get cols() {
        return this.table;
    }
    async softDelete(id) {
        const updateData = {
            deleted_at: sql`${new Date()}`,
            updated_at: sql`${new Date()}`
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].update(this.table).set(updateData).where(eq(this.cols.id, id));
    }
    async restore(id) {
        const updateData = {
            deleted_at: sql`${null}`,
            updated_at: sql`${new Date()}`
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].update(this.table).set(updateData).where(eq(this.cols.id, id));
    }
    async hardDelete(id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].delete(this.table).where(eq(this.cols.id, id));
    }
    async getAll() {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].select().from(this.table).where(isNull(this.cols.deleted_at));
    }
    async getById(id) {
        const [record] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].select().from(this.table).where(and(eq(this.cols.id, id), isNull(this.cols.deleted_at))).limit(1);
        return record ?? null;
    }
    async getAllWithDeleted() {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].select().from(this.table);
    }
    async getDeleted() {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].select().from(this.table).where(isNotNull(this.cols.deleted_at));
    }
    getUpdateTimestamp() {
        return {
            updated_at: sql`${new Date()}`
        };
    }
}
}),
"[project]/src/services/user-service.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserService",
    ()=>UserService
]);
(()=>{
    const e = new Error("Cannot find module 'drizzle-orm'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/drizzle.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$base$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/base-service.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/user.ts [middleware] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'bcrypt-ts'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
;
class UserService extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$base$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["BaseService"] {
    table = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"];
    constructor(){
        super();
    }
    async hashPassword(password) {
        const salt = genSaltSync(10);
        return hashSync(password, salt);
    }
    async comparePassword(password, hash) {
        return compareSync(password, hash);
    }
    async createUser(data) {
        const insertData = {
            ...data
        };
        if (insertData.password) {
            insertData.password = await this.hashPassword(insertData.password);
        }
        const [user] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"]).values(insertData).returning();
        return user;
    }
    async findByEmail(email) {
        const [user] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"]).where(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"].email, email));
        return user;
    }
    async findById(id) {
        const [user] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"]).where(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"].id, id));
        return user;
    }
    async findOrCreateSocialUser(providerId, data) {
        const [existing] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"]).where(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"].google_id, providerId));
        if (existing) return existing;
        const [userbyemail] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"]).where(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"].email, data.email));
        if (userbyemail) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"]).set({
                google_id: providerId,
                is_active: true,
                is_verified: true
            }).where(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"].id, userbyemail.id));
            return userbyemail;
        }
        const [newUser] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"]).values({
            ...data,
            google_id: providerId,
            is_active: true,
            is_verified: true,
            email_verified_at: new Date()
        }).returning();
        return newUser;
    }
    /**
   * Update any user field(s) by id
   */ async updateUser(id, updates) {
        const updateData = {
            ...updates
        };
        if (updateData.password) {
            updateData.password = await this.hashPassword(updateData.password);
        }
        const [user] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"]).set(updateData).where(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["users"].id, id)).returning();
        return user;
    }
}
}),
"[project]/src/services/otp-service.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OTPService",
    ()=>OTPService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/drizzle.ts [middleware] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'drizzle-orm'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$base$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/base-service.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/user.ts [middleware] (ecmascript)");
;
;
;
;
class OTPService extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$base$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["BaseService"] {
    table = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"];
    constructor(){
        super();
    }
    /**
     * Generate a random 6-digit OTP
     */ generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    /**
     * Create a new OTP for a user
     */ async createOTP(userId, type, expiryMinutes = 10) {
        await this.deleteExistingOTP(userId, type);
        const otp = this.generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);
        const insertData = {
            user_id: userId,
            otp,
            type,
            expires_at: expiresAt,
            attempts: 0
        };
        const [newOTP] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"]).values(insertData).returning();
        return newOTP;
    }
    /**
     * Verify an OTP
     */ async verifyOTP(userId, otp, type) {
        const [otpRecord] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"]).where(and(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].user_id, userId), eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].type, type), gte(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].expires_at, new Date())));
        if (!otpRecord) {
            return {
                success: false,
                message: "OTP not found or has expired"
            };
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"]).set({
            attempts: (otpRecord.attempts ?? 0) + 1,
            updated_at: new Date()
        }).where(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].id, otpRecord.id));
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
     */ async findValidOTP(userId, type) {
        const [otpRecord] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"]).where(and(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].user_id, userId), eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].type, type), gte(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].expires_at, new Date())));
        return otpRecord;
    }
    /**
     * Delete an OTP by ID
     */ async deleteOTP(otpId) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"]).where(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].id, otpId));
        return result.rowCount > 0;
    }
    /**
     * Delete existing OTP for user and type
     */ async deleteExistingOTP(userId, type) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"]).where(and(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].user_id, userId), eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].type, type)));
    }
    /**
     * Delete expired OTPs (cleanup function)
     */ async deleteExpiredOTPs() {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"]).where(gte(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].expires_at, new Date()));
        return result.rowCount;
    }
    /**
     * Get OTP attempts count
     */ async getOTPAttempts(userId, type) {
        const otpRecord = await this.findValidOTP(userId, type);
        return otpRecord?.attempts || 0;
    }
    /**
     * Check if user can request new OTP (rate limiting)
     */ async canRequestNewOTP(userId, type, cooldownMinutes = 1) {
        const [recentOTP] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"]).where(and(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].user_id, userId), eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].type, type))).orderBy(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].created_at).limit(1);
        if (!recentOTP) {
            return {
                canRequest: true
            };
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
        return {
            canRequest: true
        };
    }
    /**
     * Batch delete OTPs for a user (useful when user is deleted)
     */ async deleteUserOTPs(userId) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$drizzle$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["db"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"]).where(eq(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$user$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verification_otps"].user_id, userId));
        return result.rowCount;
    }
}
}),
"[project]/src/lib/emails/verifications/verification-email.tsx [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VerificationEmail",
    ()=>VerificationEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [middleware] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@react-email/components'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const VerificationEmail = ({ firstName, otp })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Html, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Head, {}, void 0, false, {
                fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Preview, {
                children: [
                    "Your verification code is ",
                    otp
                ]
            }, void 0, true, {
                fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Body, {
                style: main,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Container, {
                    style: container,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        style: box,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Heading, {
                                style: h1,
                                children: "Verify your email address"
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                                lineNumber: 29,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                style: text,
                                children: [
                                    "Hi ",
                                    firstName || 'there',
                                    ","
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                                lineNumber: 30,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                style: text,
                                children: "Thank you for signing up! Please use the following verification code to verify your email address:"
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                                lineNumber: 31,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                style: otpContainer,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                    style: otpText,
                                    children: otp
                                }, void 0, false, {
                                    fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                                    lineNumber: 36,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                                lineNumber: 35,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                style: text,
                                children: "This code will expire in 10 minutes. If you didn't create an account, you can safely ignore this email."
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Hr, {
                                style: hr
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                style: footer,
                                children: "For security reasons, never share this code with anyone."
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                                lineNumber: 43,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lib/emails/verifications/verification-email.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
};
const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px'
};
const box = {
    padding: '0 48px'
};
const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '40px',
    margin: '0 0 20px'
};
const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px'
};
const otpContainer = {
    backgroundColor: '#f8f9fa',
    border: '2px dashed #007ee6',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    margin: '20px 0'
};
const otpText = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#007ee6',
    letterSpacing: '8px',
    margin: '0',
    fontFamily: 'Courier, monospace'
};
const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0'
};
const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px'
};
}),
"[project]/src/lib/emails/onboarding/onboarding-response-email.tsx [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnboardingResponseEmail",
    ()=>OnboardingResponseEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [middleware] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@react-email/components'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const OnboardingResponseEmail = ({ userName, userEmail, userId, documents, verificationUrl })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Html, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Head, {}, void 0, false, {
                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Preview, {
                children: [
                    "New onboarding response from ",
                    userName
                ]
            }, void 0, true, {
                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Body, {
                style: main,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Container, {
                    style: container,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                        style: box,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Heading, {
                                style: h1,
                                children: "New Onboarding Response"
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                lineNumber: 37,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                style: text,
                                children: "A new user has completed their onboarding process."
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Hr, {
                                style: hr
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                style: infoSection,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Heading, {
                                        style: h2,
                                        children: "User Information"
                                    }, void 0, false, {
                                        fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                        style: infoText,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Name:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                                lineNumber: 47,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " ",
                                            userName
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                        lineNumber: 46,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                        style: infoText,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Email:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                                lineNumber: 50,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " ",
                                            userEmail
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                        lineNumber: 49,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                        style: infoText,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "User ID:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                                lineNumber: 53,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " ",
                                            userId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                        lineNumber: 52,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                lineNumber: 44,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Hr, {
                                style: hr
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                style: documentsSection,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Heading, {
                                        style: h2,
                                        children: "Submitted Documents"
                                    }, void 0, false, {
                                        fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    documents.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        children: documents.map((doc, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                                style: documentItem,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                                    style: documentText,
                                                    children: [
                                                        index + 1,
                                                        ". ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Link, {
                                                            href: doc,
                                                            style: link,
                                                            children: doc
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                                            lineNumber: 66,
                                                            columnNumber: 38
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                                    lineNumber: 65,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, index, false, {
                                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                                lineNumber: 64,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                        lineNumber: 62,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                        style: text,
                                        children: "No documents submitted."
                                    }, void 0, false, {
                                        fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Hr, {
                                style: hr
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                style: actionSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                    href: verificationUrl,
                                    style: buttonStyle,
                                    children: "Review and Verify User"
                                }, void 0, false, {
                                    fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Hr, {
                                style: hr
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                                style: footer,
                                children: "This is an automated notification from your Ticketuer application."
                            }, void 0, false, {
                                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/lib/emails/onboarding/onboarding-response-email.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
};
const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px'
};
const box = {
    padding: '0 48px'
};
const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '40px',
    margin: '0 0 20px'
};
const h2 = {
    color: '#333',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '32px',
    margin: '16px 0 12px'
};
const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px'
};
const infoSection = {
    marginBottom: '16px'
};
const infoText = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '8px 0'
};
const documentsSection = {
    marginTop: '16px'
};
const documentItem = {
    marginBottom: '8px'
};
const documentText = {
    color: '#333',
    fontSize: '14px',
    lineHeight: '24px',
    margin: '4px 0'
};
const link = {
    color: '#007ee6',
    textDecoration: 'underline'
};
const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0'
};
const actionSection = {
    textAlign: 'center',
    marginTop: '20px',
    marginBottom: '20px'
};
const buttonStyle = {
    backgroundColor: '#007ee6',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '12px 32px'
};
const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    marginTop: '20px'
};
}),
"[project]/src/app/(auth)/actions.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "get_user_by_email",
    ()=>get_user_by_email,
    "google_login",
    ()=>google_login,
    "login",
    ()=>login,
    "resendverificationotp",
    ()=>resendverificationotp,
    "send_onboarding_response",
    ()=>send_onboarding_response,
    "signup",
    ()=>signup,
    "trigger_verification_for_user",
    ()=>trigger_verification_for_user,
    "verifyotp",
    ()=>verifyotp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$resend$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/resend.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/user-service.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$otp$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/otp-service.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$emails$2f$verifications$2f$verification$2d$email$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/emails/verifications/verification-email.tsx [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$emails$2f$onboarding$2f$onboarding$2d$response$2d$email$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/emails/onboarding/onboarding-response-email.tsx [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/auth.ts [middleware] (ecmascript)");
"use server";
;
;
;
;
;
;
;
;
const otpService = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$otp$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["OTPService"]();
const userService = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["UserService"]();
async function signup(props) {
    const cookie = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$resend$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["resend"].emails.send({
            from: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$resend$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["from_email"],
            to: [
                props.email
            ],
            subject: "Email Verification Code",
            react: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$emails$2f$verifications$2f$verification$2d$email$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["VerificationEmail"])({
                firstName: user.first_name || "User",
                otp: otp.otp
            })
        });
        cookie.set("verify-with", user.id);
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
async function verifyotp(otp) {
    const cookie = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
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
        const updatedUser = await userService.updateUser(userId, {
            is_verified: true,
            is_active: true,
            email_verified_at: new Date()
        });
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
async function resendverificationotp() {
    const cookie = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$resend$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["resend"].emails.send({
            from: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$resend$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["from_email"],
            to: [
                user.email
            ],
            subject: "Email Verification Code",
            react: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$emails$2f$verifications$2f$verification$2d$email$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["VerificationEmail"])({
                firstName: user.first_name || "User",
                otp: otp.otp
            })
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
const login = async (props)=>{
    const cookie = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
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
        const isValid = await userService.comparePassword(props.password, user.password);
        if (!isValid) {
            return {
                success: false,
                error: "Invalid password",
                type: "invalid-password"
            };
        }
        if (!user.is_verified) {
            const otp = await otpService.createOTP(user.id, "email_verification");
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$resend$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["resend"].emails.send({
                from: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$resend$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["from_email"],
                to: [
                    user.email
                ],
                subject: "Email Verification Code",
                react: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$emails$2f$verifications$2f$verification$2d$email$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["VerificationEmail"])({
                    firstName: user.first_name || "User",
                    otp: otp.otp
                })
            });
            cookie.set("verify-with", user.id);
            return {
                success: false,
                error: "Account is not verified",
                type: "account-verification"
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
async function get_user_by_email(email) {
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
async function google_login(props) {
    try {
        const user = await userService.findOrCreateSocialUser(props.providerId, {
            email: props.email,
            first_name: props.name,
            user_type: "normal"
        });
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
async function trigger_verification_for_user(userId) {
    const cookie = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$resend$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["resend"].emails.send({
            from: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$resend$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["from_email"],
            to: [
                user.email
            ],
            subject: "Email Verification Code",
            react: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$emails$2f$verifications$2f$verification$2d$email$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["VerificationEmail"])({
                firstName: user.first_name || "User",
                otp: otp.otp
            })
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
async function send_onboarding_response({ documents }) {
    const admin_email = "giftobafaiye@gmail.com";
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["auth"])();
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$resend$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["resend"].emails.send({
            from: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$resend$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["from_email"],
            to: [
                admin_email
            ],
            subject: `New Onboarding Response - ${user.first_name || user.email}`,
            react: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$emails$2f$onboarding$2f$onboarding$2d$response$2d$email$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["OnboardingResponseEmail"])({
                userName: user.first_name || user.email,
                userEmail: user.email,
                userId: user.id,
                documents: documents,
                verificationUrl: verificationUrl
            })
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["unstable_update"])({
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
}),
"[project]/src/auth.config.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authConfig",
    ()=>authConfig
]);
(()=>{
    const e = new Error("Cannot find module 'next-auth/providers/google'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [middleware] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'next-auth/providers/credentials'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$auth$292f$actions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(auth)/actions.ts [middleware] (ecmascript)");
;
;
;
;
const authConfig = {
    providers: [
        Google({
            checks: [
                'none'
            ]
        }),
        Credentials({
            async authorize (credentials) {
                if (credentials.from_onboarding) {
                    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$auth$292f$actions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["get_user_by_email"])(credentials.email);
                    if (!data.success || !data.user) {
                        return null;
                    } else {
                        const user = {
                            ...data.user,
                            id: data.user.id,
                            email: data.user.email
                        };
                        return user;
                    }
                } else {
                    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$auth$292f$actions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["login"])({
                        email: credentials.email,
                        password: credentials.password
                    });
                    if (!data.success || !data.user) {
                        return null;
                    } else {
                        const user = {
                            ...data.user,
                            id: data.user.id,
                            email: data.user.email
                        };
                        return user;
                    }
                }
            }
        })
    ],
    basePath: '/api/auth',
    session: {
        strategy: 'jwt'
    },
    debug: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["inDevEnvironment"],
    trustHost: true,
    callbacks: {
        async signIn ({ account, profile, user }) {
            if (account?.provider === 'google' && profile?.email) {
                return true;
            }
            return !!user;
        },
        async jwt ({ token, user, account, profile, trigger, session }) {
            if (trigger === 'update') {
                token = {
                    ...token,
                    ...session.user
                };
                return token;
            }
            if (trigger === 'signIn' && account?.provider === 'credentials' && user) {
                return {
                    ...token,
                    ...user
                };
            }
            if (account && account.provider === 'google') {
                if (!profile?.email) {
                    return null;
                }
                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$auth$292f$actions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["google_login"])({
                    email: profile.email,
                    name: profile?.name,
                    providerId: account.providerAccountId,
                    avatar: profile.picture
                });
                if (!res.success) {
                    return null;
                }
                const google_user = {
                    ...res.user,
                    email: profile.email,
                    name: profile?.name,
                    profile_image: profile.picture,
                    id: res?.user?.id
                };
                return {
                    ...token,
                    ...google_user
                };
            }
            return {
                ...token,
                user
            };
        },
        async session ({ session, token }) {
            session.user = {
                ...session,
                ...token,
                emailVerified: token.email_verified_at ?? new Date()
            };
            return session;
        }
    }
};
;
}),
"[project]/src/auth.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "auth",
    ()=>auth,
    "signOut",
    ()=>signOut,
    "unstable_update",
    ()=>unstable_update
]);
(()=>{
    const e = new Error("Cannot find module 'next-auth'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/auth.config.ts [middleware] (ecmascript)");
;
;
const { handlers: { GET, POST }, auth, signOut, unstable_update } = NextAuth({
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["authConfig"],
    secret: process.env.AUTH_SECRET
});
}),
"[project]/src/routes.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_LOGIN_REDIRECT",
    ()=>DEFAULT_LOGIN_REDIRECT,
    "apiAuthPrefix",
    ()=>apiAuthPrefix,
    "authRoutes",
    ()=>authRoutes,
    "publicRoutes",
    ()=>publicRoutes
]);
const authRoutes = [
    '/forgot-password',
    '/login',
    '/reset-password',
    '/signup',
    '/verify-account',
    "/get-started"
];
const publicRoutes = [
    '/verify'
];
const apiAuthPrefix = '/api/auth';
const DEFAULT_LOGIN_REDIRECT = '/';
}),
"[project]/src/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/auth.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/routes.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$auth$292f$actions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(auth)/actions.ts [middleware] (ecmascript)");
;
;
;
;
async function proxy(req) {
    const { nextUrl } = req;
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["auth"])();
    console.log("Session in proxy:", session);
    const isLoggedIn = !!session;
    const isAuthRoute = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["authRoutes"].includes(nextUrl.pathname);
    const isApiAuthRoute = nextUrl.pathname.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["apiAuthPrefix"]);
    const isPublicRoute = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["publicRoutes"].some((route)=>nextUrl.pathname.startsWith(route));
    if (isApiAuthRoute) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    if (isPublicRoute) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    if (isAuthRoute) {
        if (isLoggedIn) {
            if (session.user.is_verified) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/', req.url));
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$auth$292f$actions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["trigger_verification_for_user"])(session.user.id);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/verify-account', req.url));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    if (!isLoggedIn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(`/login?go_to=${nextUrl.pathname}`, req.url));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/((?!.+\\.[\\w]+$|_next).*)',
        '/',
        '/(api|trpc)(.*)'
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8b758291._.js.map