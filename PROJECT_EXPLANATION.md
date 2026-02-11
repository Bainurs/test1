# ARMEL Group — Project Documentation

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [How to Run](#how-to-run)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Routes](#api-routes)
7. [Services Layer](#services-layer)
8. [Component Logic](#component-logic)
9. [SEO Strategy](#seo-strategy)
10. [Header Dynamic Contrast](#header-dynamic-contrast)
11. [Styling System](#styling-system)
12. [Responsiveness Logic](#responsiveness-logic)
13. [Form Validation](#form-validation)
14. [Admin Authentication](#admin-authentication)
15. [Analytics System](#analytics-system)
16. [Security Practices](#security-practices)
17. [How to Modify Content](#how-to-modify-content)
18. [How to Extend the Dashboard](#how-to-extend-the-dashboard)
19. [Best Practices Used](#best-practices-used)

---

## Overview

ARMEL Group is a modern, SEO-optimized corporate landing website built with Next.js 14+ (App Router), PostgreSQL, and Prisma ORM. It includes a public-facing landing page with multiple sections and a hidden admin dashboard that displays **real data** from the database.

---

## Tech Stack

| Technology     | Purpose                              |
|----------------|--------------------------------------|
| Next.js 14+    | React framework (App Router)         |
| React 18       | UI library                           |
| TypeScript     | Type-safe JavaScript                 |
| Tailwind CSS 3 | Utility-first CSS framework          |
| PostgreSQL     | Primary relational database          |
| Prisma ORM     | Database client & schema management  |
| Inter Font     | Google Font loaded via next/font     |

**No heavy external libraries** — the project uses custom SVG icons, pure-CSS charts, and built-in Next.js features.

---

## How to Run

### Prerequisites
- Node.js 18+
- PostgreSQL running locally (or a remote instance)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
#    Copy .env.example to .env and update DATABASE_URL with your PostgreSQL credentials
cp .env.example .env

# 3. Generate Prisma Client
npx prisma generate

# 4. Run database migrations (creates all tables)
npx prisma migrate dev --name init

# 5. Start development server
npm run dev

# 6. Open in browser
#    http://localhost:3000           — Landing page
#    http://localhost:3000/dashboard — Admin panel (login required)
```

### Admin Credentials (default)

- **Username:** `admin`
- **Password:** `ArmelGroup2026!#`

These are set in `.env` as `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with SEO metadata
│   ├── page.tsx                      # Landing page (home)
│   ├── globals.css                   # Global styles + Tailwind
│   ├── api/                          # API Route Handlers
│   │   ├── contact/route.ts          # POST — contact form submission
│   │   ├── newsletter/route.ts       # POST — newsletter subscription
│   │   ├── analytics/track/route.ts  # POST — track analytics events
│   │   ├── auth/
│   │   │   ├── login/route.ts        # POST — admin login
│   │   │   ├── logout/route.ts       # POST — admin logout
│   │   │   └── check/route.ts        # GET  — check auth status
│   │   └── dashboard/
│   │       ├── analytics/route.ts    # GET  — dashboard analytics
│   │       └── submissions/route.ts  # GET  — paginated submissions
│   └── dashboard/
│       ├── layout.tsx                # Auth guard + sidebar layout
│       ├── page.tsx                  # Dashboard overview (live analytics)
│       ├── login/page.tsx            # Login page
│       └── submissions/page.tsx      # Contact submissions table
│
├── components/
│   ├── ui/                           # Reusable UI primitives
│   ├── icons/                        # SVG icon components
│   ├── layout/                       # Header, Footer
│   ├── sections/                     # Landing page sections
│   ├── dashboard/                    # Dashboard components
│   └── analytics/                    # Analytics tracker
│
├── generated/prisma/                 # Auto-generated Prisma Client
├── hooks/                            # Custom React hooks
├── lib/prisma.ts                     # Prisma Client singleton
├── types/                            # TypeScript types
├── utils/                            # Helpers, constants, validation
└── services/                         # Business logic / data layer
    ├── contactService.ts             # Contact CRUD operations
    ├── newsletterService.ts          # Newsletter CRUD operations
    ├── analyticsService.ts           # Analytics tracking & aggregation
    └── authService.ts                # Auth (cookie-based sessions)

prisma/
├── schema.prisma                     # Database schema
└── migrations/                       # Migration history
```

---

## Database Schema

The project uses **PostgreSQL** with **Prisma ORM**. Four tables:

### `admin_users`
Prepared for future RBAC. Fields: id, username, password, role, created_at, updated_at.

### `contact_submissions`
Stores form submissions. Fields: id, name, phone, email, request_type, created_at.

### `newsletter_subscribers`
Unique email subscriptions. Fields: id, email (unique), created_at.

### `analytics_events`
Tracks all site analytics. Fields: id, event, page, visitor_id, metadata (JSON), created_at.
Indexed on: event, created_at, visitor_id.

---

## API Routes

| Method | Route                         | Auth  | Description                       |
|--------|-------------------------------|-------|-----------------------------------|
| POST   | `/api/contact`                | No    | Submit contact form               |
| POST   | `/api/newsletter`             | No    | Subscribe to newsletter           |
| POST   | `/api/analytics/track`        | No    | Track page_view / visit events    |
| POST   | `/api/auth/login`             | No    | Admin login (sets HTTP-only cookie)|
| POST   | `/api/auth/logout`            | No    | Admin logout (clears cookie)      |
| GET    | `/api/auth/check`             | No    | Check authentication status       |
| GET    | `/api/dashboard/analytics`    | Yes   | Get analytics overview            |
| GET    | `/api/dashboard/submissions`  | Yes   | Get paginated submissions         |

Dashboard API routes check authentication via HTTP-only cookies and return 401 if unauthorized.

---

## Services Layer

All database logic is encapsulated in the `services/` directory:

- **`contactService.ts`** — `createContact()`, `getContacts()` (with pagination/search), `getContactCount()`
- **`newsletterService.ts`** — `subscribeNewsletter()`, `getNewsletterCount()`, `getNewsletterSubscribers()`
- **`analyticsService.ts`** — `trackEvent()`, `getAnalyticsOverview()` (aggregated data with monthly breakdowns)
- **`authService.ts`** — `validateCredentials()`, `setAuthSession()`, `isAuthenticated()`, `clearAuthSession()`

This separation makes it easy to swap implementations (e.g., different database, external API).

---

## Component Logic

### Client vs Server Components
- **Server components** (default): `About`, `Services`, `News`, `Footer`, API routes
- **Client components** (`'use client'`): `Header`, `Hero`, `Newsletter`, `ContactForm`, `AnalyticsTracker`, all dashboard pages

### Data Flow
1. User fills contact form → `POST /api/contact` → server validates → Prisma writes to PostgreSQL
2. Admin visits dashboard → `GET /api/dashboard/analytics` → service queries PostgreSQL → returns aggregated data
3. Analytics tracker → `POST /api/analytics/track` → records page views and visits

---

## SEO Strategy

1. **Metadata API**: Root `layout.tsx` exports comprehensive metadata including title templates, OpenGraph, Twitter cards.
2. **Semantic HTML**: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>` used throughout.
3. **Heading hierarchy**: Proper `<h1>` → `<h2>` → `<h3>` structure.
4. **Robots.txt**: Allows crawling of public pages, blocks `/dashboard`.
5. **Sitemap.xml**: Lists all public sections.
6. **Image optimization**: Next.js configured for AVIF/WebP.
7. **Font optimization**: Inter loaded via `next/font/google` with `display: swap`.

---

## Header Dynamic Contrast

The Header implements **WCAG-compliant dynamic color contrast**:

1. On page load, it samples the Hero section's background color using `getComputedStyle()`.
2. It calculates the **relative luminance** using the W3C formula:
   - `L = 0.2126 * R + 0.7152 * G + 0.0722 * B` (with sRGB to linear conversion)
3. If luminance < 0.179 (dark background), text switches to **white**.
4. On scroll (when header gets solid white background), text reverts to **dark**.
5. All transitions are smooth (300ms CSS transitions).

---

## Styling System

### Tailwind Configuration
- **Colors**: `primary` (deep blue #1e3a8a), `accent` (gold #d4940a), `neutral` (gray scale)
- **Shadows**: `soft`, `card`, `elevated`
- **Animations**: `fadeIn`, `slideUp` keyframes

### Design Principles
- Mobile-first responsive
- Consistent spacing scale
- Rounded corners
- Soft shadows

---

## Responsiveness Logic

| Prefix | Breakpoint | Usage                    |
|--------|------------|--------------------------|
| (none) | < 640px    | Mobile-first base        |
| `sm:`  | ≥ 640px    | Small tablets            |
| `md:`  | ≥ 768px    | Show desktop nav         |
| `lg:`  | ≥ 1024px   | Desktop layouts          |
| `xl:`  | ≥ 1280px   | Wide desktop grid        |

---

## Form Validation

### Client-side (`utils/validation.ts`)
- `validateEmail()`, `validatePhone()`, `validateName()`, `validateRequired()`
- Inline error display with ARIA attributes

### Server-side (`utils/serverValidation.ts`)
- Mirrors client validation + HTML sanitization
- Protects against XSS via `sanitize()` function
- Length limits on all fields
- Strict request type validation

Both layers work together — client for UX, server for security.

---

## Admin Authentication

### Current Implementation
- Credentials in `.env` (ADMIN_USERNAME, ADMIN_PASSWORD)
- Login via `POST /api/auth/login` — sets an HTTP-only, secure cookie
- Dashboard layout checks auth via `GET /api/auth/check`
- Session expires after 8 hours

### How to Add Real Auth
1. Hash passwords with bcrypt and store in `admin_users` table
2. Add JWT or session tokens
3. Add Next.js middleware for server-side route protection
4. Add role-based access control (RBAC) using the `role` field

---

## Analytics System

### Client-side
`AnalyticsTracker` component (mounted in root layout):
- Generates a persistent visitor ID (localStorage)
- Tracks `visit` event once per session
- Tracks `page_view` on every route change

### Server-side
All events stored in `analytics_events` PostgreSQL table.

### Dashboard Display
`getAnalyticsOverview()` aggregates:
- Total visitors, unique users, page views
- Contact submissions, newsletter subscribers
- Monthly breakdowns (last 6 months) for charts

All data is **real** — no mock values.

---

## Security Practices

- **Environment variables** for DB credentials and admin password
- **Prisma ORM** prevents SQL injection (parameterized queries)
- **Input sanitization** strips HTML tags server-side
- **HTTP-only cookies** for auth (not accessible via JavaScript)
- **Secure cookie flag** in production
- **CORS-safe** API routes (same-origin by default in Next.js)
- **robots.txt** blocks admin routes from crawlers

---

## How to Modify Content

| What                 | Where                                    |
|----------------------|------------------------------------------|
| Company info         | `src/utils/constants.ts` → `COMPANY`    |
| Navigation links     | `src/utils/constants.ts` → `NAV_LINKS`  |
| Services             | `src/utils/constants.ts` → `SERVICES`   |
| News items           | `src/utils/constants.ts` → `NEWS_ITEMS` |
| Social links         | `src/utils/constants.ts` → `SOCIAL_LINKS`|
| SEO metadata         | `src/app/layout.tsx` → `metadata`        |
| Admin credentials    | `.env` → `ADMIN_USERNAME`, `ADMIN_PASSWORD`|
| Database connection  | `.env` → `DATABASE_URL`                  |

---

## How to Extend the Dashboard

### Add a new page
1. Create `src/app/dashboard/[page-name]/page.tsx`
2. Add link in `src/components/dashboard/Sidebar.tsx`
3. Create any needed components in `src/components/dashboard/`
4. Add API route in `src/app/api/dashboard/[route]/route.ts` (with auth check)

### Add a new API endpoint
1. Create route handler in `src/app/api/[path]/route.ts`
2. Add service function in `src/services/`
3. Use `isAuthenticated()` for protected routes

### Modify database schema
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Prisma Client is auto-regenerated

---

## Best Practices Used

- **TypeScript strict mode** — compile-time error catching
- **DRY principle** — shared components, centralized constants, service layer
- **Single responsibility** — each file has one purpose
- **Accessibility** — ARIA labels, WCAG contrast, semantic HTML
- **Performance** — minimal bundles, optimized fonts/images
- **SEO** — comprehensive meta tags, structured content
- **Security** — parameterized queries, input sanitization, HTTP-only cookies
- **Clean architecture** — services layer separates business logic from API routes
- **Mobile-first** — responsive design from smallest screen up
- **Error handling** — try/catch in all API routes, user-friendly error messages
- **Modular backend** — easy to replace localStorage, add auth providers, switch databases
