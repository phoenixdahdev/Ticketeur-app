# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tickeur is a full-stack SaaS event ticketing platform built with a Turborepo monorepo architecture. The system manages event creation, ticket sales, attendee management, and payment processing with team collaboration features.

## Essential Commands

### Development

```bash
# Start all apps in development mode (admin:3000, landing:3001, web:3002, app:3004)
pnpm dev

# Run specific app
pnpm --filter useticketeur-admin dev
pnpm --filter useticketeur-landing dev
pnpm --filter useticketeur-web dev
pnpm --filter useticketeur-app dev
```

### Building & Testing

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter useticketeur-web build

# Lint all workspaces
pnpm lint

# Lint specific app
pnpm --filter useticketeur-admin lint

# Type check (within specific app)
npx tsc --noEmit

# Format code
pnpm format
```

### Database Operations (packages/db)

```bash
# Generate migration files from schema changes
pnpm run db:generate

# Run migrations against database
pnpm run db:migrate

# Push schema directly to database (dev only)
pnpm run db:push

# Open Drizzle Studio (database GUI)
pnpm run db:studio
```

### Background Jobs (packages/jobs)

```bash
# Run Trigger.dev in development mode
pnpm --filter @useticketeur/jobs dev

# Deploy jobs to production
pnpm --filter @useticketeur/jobs deploy
```

### Dependency Management

```bash
# Add dependency to specific app
pnpm add <package> --filter useticketeur-web
pnpm add <package> --filter @useticketeur/ui

# Add dev dependency
pnpm add -D <package> --filter useticketeur-admin

# Add to root
pnpm add -D <package> --workspace-root

# Remove dependency
pnpm remove <package> --filter <app-or-package-name>
```

## Architecture

### Monorepo Structure

**Apps** (Next.js 16 with App Router):
- `apps/admin` - Admin dashboard (port 3000, minimal dependencies, uses MongoDB)
- `apps/landing` - Marketing page with waitlist (port 3001, uses MongoDB)
- `apps/web` - Main customer-facing application (port 3002, full-featured, uses PostgreSQL)
- `apps/app` - Marketing/showcase application (port 3004, uses shared UI components with smooth scroll)

**Packages**:
- `@useticketeur/db` - Database layer using Drizzle ORM + PostgreSQL (Neon)
- `@useticketeur/ui` - Shared shadcn/ui components library
- `@useticketeur/email` - React Email templates
- `@useticketeur/jobs` - Trigger.dev v4 background jobs
- `@useticketeur/eslint-config` - Shared ESLint configuration
- `@useticketeur/typescript-config` - Shared TypeScript configuration

### Key Technologies

- **Runtime**: React 19, Next.js 16 (App Router), Node.js >=23
- **Language**: TypeScript 5.9.3
- **Database**: PostgreSQL (Neon) via Drizzle ORM 0.45+
- **Auth**: NextAuth.js 5.0 (beta) with JWT sessions
- **State**: Zustand (client), TanStack Query (server)
- **Styling**: Tailwind CSS 4.1+, shadcn/ui (Radix UI)
- **Email**: React Email + Resend
- **Jobs**: Trigger.dev v4 (see packages/jobs/CLAUDE.md)
- **Package Manager**: pnpm 10.4.1+
- **Monorepo**: Turborepo 2.7+

### Database Architecture

**Primary Database**: PostgreSQL via Neon serverless (web app)
**Secondary Database**: MongoDB (landing app waitlist only)

**Core Entities** (in packages/db/src/schema/):
- `user.ts` - Users with email/password + OAuth, email verification via OTP
- `event.ts` - Events with approval workflow (draft → pending → approved → published)
- `ticket.ts` & `ticket-type.ts` - Ticket management with QR codes
- `payment.ts` - Multi-provider payment tracking (Paystack, Flutterwave, Stripe)
- `team.ts`, `team-member.ts`, `team-invitation.ts` - Team collaboration
- `notification.ts` - In-app notifications
- `event-session.ts`, `speaker.ts`, `event-member.ts` - Event details
- `event-approval.ts`, `event-category.ts` - Event management

**Schema Pattern**:
- UUID primary keys with `defaultRandom()`
- Timestamps (`createdAt`, `updatedAt`) on all tables
- JSONB for flexible metadata
- Enums for status fields
- Relations defined via Drizzle relations API

### Authentication System (apps/web)

Configured in `src/auth.config.ts` and `src/auth.ts`:

**Providers**:
1. **Credentials** - Email/password with bcrypt hashing (10 rounds)
2. **Google OAuth** - Auto-creates users via `google_login()` action

**Session Strategy**: JWT-based, stored in cookies

**Route Protection** (apps/web/src/routes.ts):
- Auth routes: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-account`, `/get-started`
- Public routes: `/verify`
- API prefix: `/api/auth`
- Default redirect: `/` (dashboard)

**Email Verification**:
- 6-digit OTP codes
- 10-minute expiration
- Stored in `verification_otps` table
- Sent via Trigger.dev email tasks

**Server Actions Pattern** (apps/web/src/app/(auth)/action.ts):
- `login()` - Credential authentication
- `signup()` - User registration with OTP generation
- `verifyotp()` - OTP verification
- `resendverificationotp()` - Resend OTP
- `google_login()` - OAuth user creation/lookup
- `get_user_by_email()` - User lookup helper

### Server Actions Over API Routes

This project uses Next.js Server Actions exclusively. Files with server actions start with `'use server'` directive and are typically in `actions/` directories or colocated with pages.

**Pattern**:
```typescript
'use server'
import { db } from '@useticketeur/db'

export async function myAction(data: MySchema) {
  // Direct database access, no API route needed
  const result = await db.query.users.findFirst(...)
  return { success: true, data: result }
}
```

### Shared UI Package (@useticketeur/ui)

**Import Pattern**:
```typescript
import { Button } from '@useticketeur/ui/button'
import { useToast } from '@useticketeur/ui/hooks/use-toast'
import { cn } from '@useticketeur/ui/lib/utils'
```

**Key Exports** (see packages/ui/package.json):
- Components: All shadcn/ui components (button, form, dialog, etc.)
- Providers: `theme-provider`, `query-provider`, `default-provider`
- Hooks: Various React hooks in `hooks/*`
- Utilities: `lib/utils`, `lib/upload`
- Fonts: Custom fonts via `fonts` export
- Styling: `globals.css`, `postcss.config`

**Adding Components**:
```bash
# Add to ui package (recommended)
pnpm dlx shadcn@latest add <component> -c packages/ui

# Add to specific app
pnpm dlx shadcn@latest add <component> -c apps/web
```

### Path Aliases

All apps use `@/` to reference their `src` directory:
```typescript
import { something } from '@/lib/utils'
import { MyComponent } from '@/components/my-component'
```

### Background Jobs (Trigger.dev v4)

Jobs are in `packages/jobs`. See `packages/jobs/CLAUDE.md` for complete Trigger.dev v4 documentation.

**Key Points**:
- Use `task()` from `@trigger.dev/sdk` (v4), NOT `client.defineJob()` (v2)
- Tasks automatically handle retries, long execution times, and checkpointing
- Email sending is handled via Trigger.dev tasks, not directly in server actions

**Common Tasks**:
- `send-verification-email` - OTP emails
- `send-email-verification-otp` - Verification flow trigger

### Environment Variables

**Web App** (apps/web/.env):
```env
APP_NAME=Tickeur
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
AUTH_GOOGLE_ID=<google-oauth-client-id>
AUTH_GOOGLE_SECRET=<google-oauth-client-secret>
DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db>
TRIGGER_SECRET_KEY=<trigger-dev-secret>
TRIGGER_PROJECT_ID=<trigger-dev-project>
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
```

**Landing App** (apps/landing/.env):
```env
MONGODB_URI=mongodb://localhost:27017/tickeur
RESEND_API_KEY=<resend-api-key>
TRIGGER_PROJECT_ID=<trigger-project-id>
TRIGGER_SECRET_KEY=<trigger-secret>
```

**Admin App** (apps/admin/.env):
```env
RESEND_KEY=<resend-api-key>
MONGO_URL=mongodb://localhost:27017/tickeur
```

**Database Package** (packages/db/.env):
```env
DATABASE_URL=postgresql://...
```

**Jobs Package** (packages/jobs/.env):
```env
TRIGGER_PROJECT_ID=<project-id>
TRIGGER_SECRET_KEY=<secret-key>
RESEND_API_KEY=<resend-api-key>
```

Variables in `turbo.json` `globalEnv` are automatically passed to all apps during builds.

### Database Migration Workflow

1. **Modify schema** in `packages/db/src/schema/*.ts`
2. **Generate migration**: `pnpm run db:generate` (creates SQL in `migrations/`)
3. **Review migration** SQL files before applying
4. **Apply migration**: `pnpm run db:migrate`
5. **For dev rapid iteration**: `pnpm run db:push` (skips migration files)

**Important**: The database package uses Drizzle ORM. Schema changes must be made in TypeScript schema files, not raw SQL.

### Form Handling Pattern

Standard pattern across apps:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  // ...
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' }
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    const result = await myServerAction(data)
    // Handle result with toast notifications
  }
}
```

### Validation Pattern

Zod schemas are used throughout:
1. **Define schema** for validation
2. **Use in forms** via `zodResolver`
3. **Use in server actions** to validate input
4. **Define in database package** for type safety

### Component Patterns

- **Server components by default** (Next.js App Router)
- **Explicit `"use client"`** for interactivity
- **TypeScript interfaces** for all props
- **Class-variance-authority (cva)** for component variants

### Error Handling

- **Server Actions**: Try-catch with typed responses `{ success: boolean, error?: string }`
- **UI Feedback**: Toast notifications via Sonner (`@useticketeur/ui/sonner`)
- **Form Errors**: React Hook Form error display

### Security Considerations

- **Password hashing**: bcrypt-ts with 10 rounds
- **JWT sessions**: Handled by NextAuth.js
- **Environment validation**: Using @t3-oss/env-nextjs in apps
- **SQL injection protection**: Drizzle ORM parameterized queries
- **XSS protection**: React's built-in escaping + proper sanitization

## Common Workflows

### Adding a New Feature to Web App

1. Define database schema changes in `packages/db/src/schema/`
2. Run `pnpm run db:generate` and `pnpm run db:migrate`
3. Create server actions in `apps/web/src/app/<feature>/action.ts`
4. Build UI components using `@useticketeur/ui` components
5. Add routes in `apps/web/src/app/` following App Router conventions
6. If background jobs needed, add to `packages/jobs/src/trigger/`

### Working with Trigger.dev Jobs

1. Refer to `packages/jobs/CLAUDE.md` for complete v4 documentation
2. Define tasks using `task()` from `@trigger.dev/sdk`
3. Test locally with `pnpm --filter @useticketeur/jobs dev`
4. Deploy with `pnpm --filter @useticketeur/jobs deploy`

### Debugging Issues

- **Type errors**: Run `npx tsc --noEmit` in specific app
- **Build failures**: Check Turbo cache, try `pnpm build` at root
- **Database issues**: Check `DATABASE_URL`, run `pnpm run db:studio`
- **Auth issues**: Verify `AUTH_SECRET` is set, check NextAuth.js callbacks
- **Job failures**: Check Trigger.dev dashboard, review task retry configuration

## CI/CD

GitHub Actions workflows in `.github/workflows/`:
- `build.yml` - Builds all apps on PRs and main pushes (Node.js 22, note: package.json requires >=23 for local dev)
- `release-trigger-prod.yml` - Deploys Trigger.dev jobs on main pushes

## Important Notes

- **Node.js version**: Requires Node.js >=23 (see package.json engines)
- **pnpm version**: 10.4.1+ required (see packageManager in root package.json)
- **Drizzle ORM version**: 0.45+ (breaking changes from 0.44, check migrations)
- **NextAuth.js**: Using beta v5, API differs from v4
- **Trigger.dev**: v4 SDK, NOT compatible with v2/v3 patterns
- **React**: Version 19 (latest, may have library compatibility issues)
- **Tailwind CSS**: Version 4.1+ (new config format)

## Tech Stack Quick Reference

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Next.js 16 App Router |
| Styling | Tailwind CSS 4.1, shadcn/ui |
| Backend | Next.js Server Actions |
| Database | PostgreSQL (Neon), Drizzle ORM |
| Auth | NextAuth.js 5 beta |
| State | Zustand, TanStack Query |
| Forms | React Hook Form, Zod |
| Email | React Email, Resend |
| Jobs | Trigger.dev v4 |
| Monorepo | Turborepo, pnpm workspaces |
