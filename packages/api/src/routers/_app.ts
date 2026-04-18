import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import { createTRPCRouter } from "../trpc"

export const appRouter = createTRPCRouter({})

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
