# Technical Requirements Document

## Tickeur - Event Ticketing Platform

---

## 1. Executive Summary

Tickeur is a full-stack SaaS event ticketing platform built with a monorepo architecture using Turborepo and pnpm. The application manages event creation, ticket sales, attendee management, and payment processing with team collaboration features.

---

## 2. Project Architecture

### 2.1 Repository Structure

```
tickeur/
├── apps/
│   ├── admin/          (Port 3000) - Admin dashboard
│   ├── landing/        (Port 3001) - Marketing landing page
│   └── web/            (Port 3002) - Main user-facing application
├── packages/
│   ├── db/             - Database layer (Drizzle ORM + PostgreSQL)
│   ├── ui/             - Shared UI components (shadcn/ui)
│   ├── email/          - Email templates (React Email)
│   ├── jobs/           - Background jobs (Trigger.dev)
│   ├── eslint-config/  - Shared ESLint configuration
│   └── typescript-config/ - Shared TypeScript configuration
```

### 2.2 Monorepo Requirements

| Requirement | Specification |
|-------------|---------------|
| Package Manager | pnpm 10.4.1+ |
| Build System | Turborepo 2.6.1+ |
| Node.js | >= 22.x |

---

## 3. Technology Stack

### 3.1 Frontend

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | React | 19.2.0 |
| Framework | Next.js (App Router) | 16.0.3 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | 4.1.17 |
| UI Components | shadcn/ui (Radix UI) | Latest |
| Icons | Lucide React | 0.554.0 |
| Forms | React Hook Form | 7.66.1 |
| Validation | Zod | 4.1.12 |
| Animation | Framer Motion | 12.23.24 |

### 3.2 State Management

| Component | Technology | Version |
|-----------|-----------|---------|
| Client State | Zustand | 5.0.8 |
| Server State | TanStack React Query | 5.90.7 |

### 3.3 Backend & Database

| Component | Technology | Version |
|-----------|-----------|---------|
| Database | PostgreSQL (Neon) | Latest |
| ORM | Drizzle ORM | 0.44.7 |
| Database Driver | @neondatabase/serverless | 1.0.2 |
| Password Hashing | bcrypt-ts | 7.1.0 |
| Migrations | Drizzle Kit | 0.31.7 |

### 3.4 Authentication

| Component | Technology | Version |
|-----------|-----------|---------|
| Auth Framework | NextAuth.js | 5.0.0-beta.30 |
| Session Strategy | JWT-based | - |
| Providers | Credentials, Google OAuth | - |

### 3.5 Email & Background Jobs

| Component | Technology | Version |
|-----------|-----------|---------|
| Email Templates | React Email | 5.0.3 |
| Email Sending | Resend | 6.5.0 |
| Job Queue | Trigger.dev | 4.1.0 |

---

## 4. Database Schema

### 4.1 Core Entities

#### Users & Authentication

```sql
users
├── id (UUID, PK)
├── email (VARCHAR, UNIQUE, NOT NULL)
├── username (VARCHAR, UNIQUE)
├── first_name, last_name (VARCHAR)
├── user_type (ENUM: admin | normal)
├── password (VARCHAR, hashed)
├── avatar (TEXT)
├── registration_documents (JSONB)
├── is_active, is_verified, is_onboarded (BOOLEAN)
├── last_login_at, email_verified_at (TIMESTAMP)
├── created_at, updated_at (TIMESTAMP)

verification_otps
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── otp (VARCHAR)
├── type (VARCHAR: email-verification, password-reset)
├── expires_at (TIMESTAMP)
├── attempts (INTEGER)
├── created_at, updated_at (TIMESTAMP)
```

#### Events

```sql
events
├── id (UUID, PK)
├── organizer_id (UUID, FK → users)
├── team_id (UUID, FK → teams)
├── title, description (VARCHAR/TEXT)
├── banner_image (TEXT)
├── venue_name, venue_address (VARCHAR/TEXT)
├── latitude, longitude (DECIMAL)
├── event_type (ENUM: concert, conference, workshop, seminar, festival, sports, exhibition, networking, party, other)
├── status (ENUM: draft, pending_approval, approved, rejected, published, cancelled, completed)
├── start_date, end_date (TIMESTAMP)
├── max_attendees (INTEGER)
├── is_free, is_featured (BOOLEAN)
├── metadata (JSONB)
├── created_at, updated_at (TIMESTAMP)
```

#### Tickets

```sql
ticket_types
├── id (UUID, PK)
├── event_id (UUID, FK → events)
├── name, description (VARCHAR/TEXT)
├── price (DECIMAL: 10.2)
├── quantity_available, quantity_sold (INTEGER)
├── max_per_order (INTEGER, default 10)
├── sales_start, sales_end (TIMESTAMP)
├── is_active (BOOLEAN)
├── benefits (JSONB array)
├── created_at, updated_at (TIMESTAMP)

tickets
├── id (UUID, PK)
├── event_id (UUID, FK → events)
├── ticket_type_id (UUID, FK → ticket_types)
├── user_id (UUID, FK → users)
├── payment_id (UUID, FK → payments)
├── ticket_number (VARCHAR, UNIQUE)
├── qr_code (VARCHAR, UNIQUE)
├── status (ENUM: reserved, paid, used, cancelled, refunded)
├── attendee_name, attendee_email (VARCHAR)
├── checked_in_at (TIMESTAMP)
├── metadata (JSONB)
├── created_at, updated_at (TIMESTAMP)
```

#### Payments

```sql
payments
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── ticket_id (UUID, FK → tickets)
├── transaction_reference (VARCHAR, UNIQUE)
├── amount, fee, net_amount (DECIMAL: 10.2)
├── currency (VARCHAR, default 'NGN')
├── payment_method (ENUM: card, bank_transfer, ussd, mobile_money)
├── payment_provider (ENUM: paystack, flutterwave, stripe)
├── status (ENUM: pending, processing, successful, failed, refunded)
├── provider_response (JSONB)
├── failure_reason (TEXT)
├── paid_at (TIMESTAMP)
├── created_at, updated_at (TIMESTAMP)
```

#### Teams

```sql
teams
├── id (UUID, PK)
├── owner_id (UUID, FK → users)
├── name, description (VARCHAR/TEXT)
├── logo (TEXT)
├── is_active (BOOLEAN)
├── created_at, updated_at (TIMESTAMP)

team_members
├── id (UUID, PK)
├── team_id (UUID, FK → teams)
├── user_id (UUID, FK → users)
├── role (VARCHAR)
├── joined_at (TIMESTAMP)

team_invitations
├── id (UUID, PK)
├── team_id (UUID, FK → teams)
├── email (VARCHAR)
├── status (VARCHAR)
├── expires_at (TIMESTAMP)
├── created_at (TIMESTAMP)
```

#### Event Supporting Entities

```sql
event_members
├── event_id, user_id, role, joined_at

event_sessions
├── event_id, title, description, start_time, end_time, location, speaker_id

speakers
├── event_id, name, bio, image, social_links (JSONB)

event_categories
├── name, description

event_approvals
├── event_id, status, notes, timestamps

notifications
├── user_id, type, title, message, metadata (JSONB), is_read
```

---

## 5. Authentication System

### 5.1 Authentication Flow

#### Signup Flow
1. User submits signup form (email, password, name)
2. Validate with Zod schema
3. Check for existing user
4. Create user with hashed password (bcrypt, 10 rounds)
5. Generate 6-digit OTP
6. Send OTP via Trigger.dev email task
7. Redirect to verification page

#### Login Flow
1. User submits credentials
2. Find user by email
3. Check email verification status
4. Verify password with bcrypt
5. Create JWT session token
6. Redirect to dashboard

#### Email Verification
- 6-digit OTP codes
- 10-minute expiration
- Max retry attempts tracked

### 5.2 OAuth Providers
- Google OAuth with automatic user creation
- Email-based user matching for existing accounts

### 5.3 Route Protection

**Auth Routes:** `/forgot-password`, `/login`, `/reset-password`, `/signup`, `/verify-account`, `/get-started`

**Public Routes:** `/verify`

**Default Redirect:** `/` (dashboard)

---

## 6. API Structure

### 6.1 Server Actions

The application uses Next.js Server Actions instead of traditional REST APIs:

| Action | Description |
|--------|-------------|
| `login()` | Credentials-based authentication |
| `signup()` | User registration with OTP |
| `verifyotp()` | OTP verification |
| `resendverificationotp()` | Resend OTP email |
| `google_login()` | Google OAuth handler |
| `get_user_by_email()` | User lookup |

### 6.2 NextAuth Routes

- `/api/auth/signin`
- `/api/auth/callback/google`
- `/api/auth/session`
- `/api/auth/signout`

---

## 7. Background Jobs

### 7.1 Trigger.dev Configuration

| Setting | Value |
|---------|-------|
| Max Duration | 60 seconds |
| Max Retries | 3 attempts |
| Backoff | Exponential |
| Concurrency | 10 (email tasks) |

### 7.2 Defined Tasks

| Task | Purpose |
|------|---------|
| `send-verification-email` | Send OTP verification emails |
| `send-email-verification-otp` | Trigger email verification flow |

---

## 8. UI Components

### 8.1 Shared Component Library (@useticketeur/ui)

**Form Components:** input, textarea, button, select, checkbox, radio-group, toggle, form, input-otp, date picker

**Layout Components:** card, container, sidebar, drawer, sheet, dialog, modal, popover

**Data Display:** table, tabs, accordion, breadcrumb, pagination, badge, avatar, skeleton

**Interactive:** dropdown-menu, context-menu, navigation-menu, tooltip, progress, slider, switch

**Charts:** Recharts integration (line, bar, pie charts)

### 8.2 Theme System

- Light/dark mode support
- Custom fonts: Transforma Sans, Trap
- CSS variables for theming
- Tailwind CSS custom properties

---

## 9. Environment Variables

### 9.1 Web App (apps/web)

```env
# App Configuration
APP_NAME=Tickeur
AUTH_SECRET=<generated-secret>

# Google OAuth
AUTH_GOOGLE_ID=<google-client-id>
AUTH_GOOGLE_SECRET=<google-client-secret>

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Background Jobs
TRIGGER_SECRET_KEY=<trigger-dev-secret>
TRIGGER_PROJECT_ID=<trigger-dev-project-id>
```

### 9.2 Landing App (apps/landing)

```env
MONGODB_URI=mongodb://localhost:27017/tickeur
RESEND_KEY=<resend-api-key>
TRIGGER_PROJECT_ID=<trigger-project-id>
TRIGGER_SECRET_KEY=<trigger-secret>
```

### 9.3 Database Package (packages/db)

```env
DATABASE_URL=postgresql://...
```

### 9.4 Jobs Package (packages/jobs)

```env
TRIGGER_PROJECT_ID=...
TRIGGER_SECRET_KEY=...
RESEND_API_KEY=...
```

---

## 10. Build & Deployment

### 10.1 Build Commands

```bash
pnpm dev          # Start all apps in development
pnpm build        # Build all apps for production
pnpm lint         # Lint all workspaces
pnpm format       # Format with Prettier
```

### 10.2 Database Commands

```bash
pnpm run db:generate  # Generate migrations
pnpm run db:migrate   # Run migrations
pnpm run db:push      # Push schema directly
pnpm run db:studio    # Open Drizzle Studio
```

### 10.3 Development Ports

| App | Port |
|-----|------|
| Admin | 3000 |
| Landing | 3001 |
| Web | 3002 |
| Email Preview | 3004 |

### 10.4 CI/CD (GitHub Actions)

**Build Workflow:**
- Triggers: push to main, PRs to main
- Steps: checkout, setup pnpm, setup Node.js 22.x, install deps, build

**Deployment Workflow:**
- Triggers: push to main
- Deploys Trigger.dev jobs to production

---

## 11. External Services

| Service | Purpose |
|---------|---------|
| Neon | PostgreSQL hosting |
| Google Cloud | OAuth provider |
| Resend | Email delivery |
| Trigger.dev | Background jobs |
| Unsplash | Image hosting |

---

## 12. Application Features

### 12.1 User Management
- Email/password registration
- Google OAuth login
- Email verification (OTP)
- User profiles
- Admin/normal user types

### 12.2 Event Management
- Event creation and editing
- Multiple event types
- Status workflow (draft → published)
- Venue management with coordinates
- Team-based organization

### 12.3 Ticket Management
- Multiple ticket types per event
- Dynamic pricing
- Quantity tracking
- Sales windows
- QR code generation
- Check-in functionality

### 12.4 Payments
- Multiple providers (Paystack, Flutterwave, Stripe)
- Multiple methods (card, bank transfer, USSD, mobile money)
- Currency support (NGN default)
- Transaction tracking

### 12.5 Teams
- Team creation
- Member management with roles
- Invitation system

### 12.6 Notifications
- In-app notifications
- Email notifications
- Read/unread tracking

---

## 13. Code Conventions

### 13.1 Imports
- Path aliases: `@/` → `src/`
- Monorepo packages: `@useticketeur/db`, `@useticketeur/ui`

### 13.2 Database Patterns
- Type-safe Drizzle ORM queries
- UUID primary keys with `defaultRandom()`
- Timestamps on all tables
- JSONB for flexible metadata

### 13.3 Component Patterns
- Server components by default
- Explicit `"use client"` directive
- TypeScript interfaces for props
- Class-variance-authority for variants

### 13.4 Error Handling
- Try-catch in server actions
- Toast notifications (Sonner)
- Typed error responses

### 13.5 Security
- bcrypt password hashing (10 rounds)
- JWT session tokens
- Environment variable validation (@t3-oss/env-nextjs)

---

## 14. Pre-Deployment Checklist

- [ ] Configure all environment variables
- [ ] Run database migrations
- [ ] Pass TypeScript type checking
- [ ] Pass ESLint
- [ ] Build all apps successfully
- [ ] Configure OAuth credentials
- [ ] Set up Trigger.dev project
- [ ] Configure Resend API key
- [ ] Set up Neon database

---

## 15. Scaling Considerations

- PostgreSQL connection pooling via Neon
- Trigger.dev for reliable job processing
- Next.js Image optimization
- CDN for static assets
- Proper database indexing
