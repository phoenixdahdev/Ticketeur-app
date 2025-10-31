# Responsive Header and Sidebar Implementation

This document explains the responsive layout system implemented for the home section of the application.

## Overview

The application now has a fully responsive layout with:
- **Mobile**: Hamburger menu → slide-in sidebar, header with filters
- **Desktop**: Persistent sidebar on left, header with search/filters/CTA on top

## Components Created

### 1. Zustand Store (`src/store/sidebar-store.ts`)

State management for mobile sidebar toggle:
```typescript
{
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}
```

### 2. Header Component (`src/app/(home)/components/header.tsx`)

**Mobile Version:**
- Hamburger menu button (toggles sidebar)
- Centered logo
- Search bar below
- Three filter dropdowns (Option, Month, Industry)

**Desktop Version:**
- Greeting: "Hello [First Name] [Last Name]"
- Search bar
- Three filter dropdowns
- "Create Event" CTA button (purple)

### 3. Mobile Sidebar (`src/app/(home)/components/mobile-sidebar.tsx`)

Features:
- Slides in from left with backdrop overlay
- Closes on route change
- Closes on backdrop click
- Navigation links (Dashboard, My Events, Analytics)
- Onboarding status CTA (same as desktop)
- Logout button at bottom
- Uses Framer Motion for smooth animations
- Locks body scroll when open

### 4. Updated Desktop Sidebar (`src/app/(home)/components/sidebar.tsx`)

Changes:
- Added `hidden lg:flex` classes to hide on mobile
- Maintains all existing functionality
- Shows only on desktop (lg breakpoint and above)

### 5. Updated Layout (`src/app/(home)/layout.tsx`)

New structure:
```
<Root Container>
  <Desktop Sidebar (hidden on mobile)>
  <Mobile Sidebar (hidden on desktop)>
  <Main Content Area>
    <Header (responsive)>
    <Page Content>
```

## Responsive Breakpoints

- **Mobile**: < 1024px (lg breakpoint)
  - Header visible with hamburger menu
  - Mobile sidebar toggleable
  - Desktop sidebar hidden

- **Desktop**: ≥ 1024px
  - Desktop sidebar visible
  - Mobile sidebar hidden
  - Header shows full layout with all controls

## State Management

### Sidebar Toggle (Mobile Only)

Using Zustand for global state:

```typescript
import { useSidebarStore } from '~/store/sidebar-store'

const { isOpen, toggle, close } = useSidebarStore()
```

**Usage:**
- Header hamburger button: calls `toggle()`
- Mobile sidebar: uses `isOpen` to show/hide
- Auto-close on route change
- Close on backdrop click

## Features

### Mobile Sidebar Features
- ✅ Slide-in animation from left
- ✅ Backdrop overlay (semi-transparent black)
- ✅ Close button in header
- ✅ Auto-close on navigation
- ✅ Body scroll lock when open
- ✅ Smooth spring animation
- ✅ Navigation links with active states
- ✅ Onboarding CTA
- ✅ Logout button

### Header Features
- ✅ Responsive design (mobile/desktop)
- ✅ Search functionality
- ✅ Filter dropdowns (Option, Month, Industry)
- ✅ User greeting (desktop only)
- ✅ Create Event CTA (desktop only)
- ✅ Hamburger menu (mobile only)

### Desktop Sidebar Features
- ✅ Hidden on mobile
- ✅ Persistent on desktop
- ✅ Navigation with active states
- ✅ Onboarding status CTA
- ✅ Logout button
- ✅ Purple accent background

## Dependencies

- **zustand**: State management for sidebar
- **framer-motion**: Animations for mobile sidebar
- **lucide-react**: Icons (Menu, Search, X, etc.)
- **next-auth**: User session data

## Styling

- Uses Tailwind CSS for all styling
- Responsive utility classes (lg:, md:, etc.)
- Custom purple theme colors
- Shadow and border utilities

## User Flow

### Mobile:
1. User opens app on mobile
2. Sees header with logo and hamburger
3. Taps hamburger → sidebar slides in
4. Can navigate or close sidebar
5. Sidebar auto-closes on navigation

### Desktop:
1. User opens app on desktop
2. Sees persistent sidebar on left
3. Header shows greeting and controls
4. Can search, filter, and create events
5. Sidebar always visible

## Testing Checklist

- [ ] Mobile sidebar toggles correctly
- [ ] Desktop sidebar shows on large screens
- [ ] Mobile sidebar hides on large screens
- [ ] Header is responsive
- [ ] Filters work on both mobile and desktop
- [ ] Navigation links work correctly
- [ ] Onboarding CTA appears when needed
- [ ] Logout functionality works
- [ ] Animations are smooth
- [ ] Body scroll locks on mobile sidebar open
- [ ] Route changes close mobile sidebar
