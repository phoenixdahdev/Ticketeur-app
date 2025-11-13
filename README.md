# Tickeur - Event Ticketing Platform

A modern event ticketing platform built with Next.js, TypeScript, and Turborepo monorepo architecture.

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Installing Dependencies](#installing-dependencies)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Adding UI Components](#adding-ui-components)
- [Project Architecture](#project-architecture)

## Project Structure

This is a monorepo managed by [Turborepo](https://turbo.build) and [pnpm workspaces](https://pnpm.io/workspaces).

```
tickeur/
├── apps/
│   ├── admin/          # Admin dashboard (Port 3000)
│   ├── landing/        # Landing page with waitlist (Port 3001)
│   └── web/            # Main web application (Port 3002)
├── packages/
│   ├── ui/             # Shared UI components (shadcn/ui)
│   ├── email/          # Email templates (React Email)
│   ├── jobs/           # Background jobs (Trigger.dev)
│   ├── eslint-config/  # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
└── package.json
```

### Apps

- **admin** - Admin dashboard for managing events, tickets, and users
- **landing** - Marketing landing page with email waitlist functionality
- **web** - Main customer-facing application for browsing and purchasing tickets

### Packages

- **@useticketeur/ui** - Shared React components built with shadcn/ui and Tailwind CSS
- **@useticketeur/email** - Email templates using React Email
- **@useticketeur/jobs** - Background jobs and scheduled tasks with Trigger.dev
- **@useticketeur/eslint-config** - Shared ESLint configurations
- **@useticketeur/typescript-config** - Shared TypeScript configurations

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Email:** [React Email](https://react.email/) + [Resend](https://resend.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Background Jobs:** [Trigger.dev](https://trigger.dev/)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Monorepo:** [Turborepo](https://turbo.build/)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 22.x
- **pnpm** >= 10.4.1
- **MongoDB** (local or cloud instance)

### Installing pnpm

```bash
npm install -g pnpm
```

## Getting Started

1. **Clone the repository:**

```bash
git clone <repository-url>
cd tickeur
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Set up environment variables:**

Create `.env.local` files in each app directory (see [Environment Variables](#environment-variables))

4. **Start development servers:**

```bash
pnpm dev
```

This will start all apps concurrently:
- Admin: http://localhost:3000
- Landing: http://localhost:3001
- Web: http://localhost:3002

## Installing Dependencies

### Install for All Workspaces

To install dependencies for the entire monorepo:

```bash
pnpm install
```

### Install for a Specific App

To add a dependency to a specific app:

```bash
# Syntax: pnpm add <package> --filter <app-name>

# Examples:
pnpm add axios --filter useticketeur-admin
pnpm add mongoose --filter useticketeur-landing
pnpm add stripe --filter useticketeur-web
```

### Install for a Specific Package

To add a dependency to a specific package:

```bash
# Examples:
pnpm add lucide-react --filter @useticketeur/ui
pnpm add @react-email/components --filter @useticketeur/email
```

### Install Dev Dependencies

To add dev dependencies:

```bash
# For specific app:
pnpm add -D @types/node --filter useticketeur-admin

# For specific package:
pnpm add -D tailwindcss --filter @useticketeur/ui

# For root:
pnpm add -D prettier --workspace-root
```

### Remove Dependencies

To remove a dependency:

```bash
pnpm remove <package> --filter <app-or-package-name>
```

### List All Workspaces

To see all available workspaces:

```bash
pnpm list --depth 0
```

## Development

### Run All Apps in Development Mode

```bash
pnpm dev
```

### Run a Specific App

```bash
# Admin dashboard
pnpm --filter useticketeur-admin dev

# Landing page
pnpm --filter useticketeur-landing dev

# Web app
pnpm --filter useticketeur-web dev
```

### Build All Apps

```bash
pnpm build
```

### Build a Specific App

```bash
pnpm --filter useticketeur-admin build
pnpm --filter useticketeur-landing build
pnpm --filter useticketeur-web build
```

### Lint

```bash
# Lint all workspaces
pnpm lint

# Lint specific app
pnpm --filter useticketeur-admin lint
```

### Format Code

```bash
pnpm format
```

## Environment Variables

Each app requires its own `.env.local` file. Create these files in the respective app directories.

### apps/landing/.env.local

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/tickeur

# Resend (for email)
RESEND_KEY=your_resend_api_key
```

### apps/admin/.env.local

```env
# Add admin-specific environment variables here
MONGODB_URI=mongodb://localhost:27017/tickeur
```

### apps/web/.env.local

```env
# Add web app-specific environment variables here
MONGODB_URI=mongodb://localhost:27017/tickeur
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Lint all workspaces |
| `pnpm format` | Format all files with Prettier |

## Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components. Components are stored in the shared `@useticketeur/ui` package.

### Add a New Component

To add a new shadcn/ui component:

```bash
# Add to the ui package
pnpm dlx shadcn@latest add button -c packages/ui

# Or add to a specific app
pnpm dlx shadcn@latest add button -c apps/web
```

### Use Components in Your App

Import components from the shared UI package:

```tsx
import { Button } from '@useticketeur/ui/components/button'

export default function MyComponent() {
  return <Button>Click me</Button>
}
```

## Project Architecture

### Path Aliases

All apps use the `@/` path alias to reference the `src` directory:

```typescript
// Instead of: import { something } from '../../../lib/utils'
import { something } from '@/lib/utils'
```

### Database Models

Database models are defined using Mongoose with Zod validation:

```typescript
// apps/landing/src/model.ts
import { z } from "zod";
import mongoose from "mongoose";

// Zod schema for validation
export const waitListSchema = z.object({
  email: z.string().email()
});

// Mongoose model
const WaitList = mongoose.model("WaitList", schema);
```

### Server Actions

This project uses Next.js Server Actions instead of API routes:

```typescript
// apps/landing/src/actions/waitlist.ts
"use server";

export async function addToWaitlist(email: string) {
  // Server-side logic here
}
```

### Shared Packages

- **UI Package**: Import shared components, hooks, and utilities
- **Email Package**: Reusable email templates
- **Config Packages**: Shared TypeScript and ESLint configs across all apps

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run `pnpm lint` and `pnpm build` to ensure everything works
4. Submit a pull request

## License

Private - All rights reserved
