import { betterAuth } from "better-auth";
import { env } from "../../env";

export const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL ?? env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "http://localhost:3000",
    appName: env.APP_NAME,
});