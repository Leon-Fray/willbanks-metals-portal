# Willbanks Metals — Customer Portal

A full-stack customer portal for Willbanks Metals, built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## Quick Start

```bash
# 1. Clone and install
cd willbanks-metals-portal
npm install

# 2. Configure environment (optional — works in demo mode without Supabase)
cp .env.example .env.local
# Edit .env.local with your Supabase project URL and anon key

# 3. Start development server
npm run dev
# → http://localhost:3000  (auto-redirects to /dashboard in demo mode)
```

> **Demo Mode**: If `NEXT_PUBLIC_SUPABASE_URL` is not set, the app uses local mock data and skips auth. All pages, filters, and interactions are fully functional without a Supabase project.

---

## Supabase Setup

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com), create a project, and copy your URL + anon key into `.env.local`.

### 2. Run migrations
```bash
npx supabase db push
# or paste supabase/migrations/001_schema.sql into the Supabase SQL editor
```

### 3. Seed demo data
```bash
# Paste supabase/seed.sql into the Supabase SQL editor
```

### 4. Create a demo user
In the Supabase dashboard → Authentication → Users, create:
- **Email**: `j.santos@lonestarfab.com`
- **Password**: your choice

Then in the SQL editor, set the `app_metadata`:
```sql
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  raw_app_meta_data,
  '{company_id}',
  '"a0000000-0000-0000-0000-000000000001"'
)
WHERE email = 'j.santos@lonestarfab.com';
```

And insert the portal user row:
```sql
INSERT INTO users (id, email, full_name, company_id, role)
SELECT id, email, 'J. Santos', 'a0000000-0000-0000-0000-000000000001', 'admin'
FROM auth.users WHERE email = 'j.santos@lonestarfab.com';
```

---

## Architecture Overview

```
src/
├── app/
│   ├── (auth)/login/          # Login page (email/password)
│   ├── (portal)/              # Protected portal layout
│   │   ├── layout.tsx         # Shell: Topbar + Sidebar
│   │   ├── dashboard/         # KPI cards, orders table, alerts
│   │   ├── orders/            # Active orders list + [id] detail + history + new
│   │   ├── alerts/            # Full alerts management
│   │   ├── quotes/            # Quotes with accept/extend
│   │   ├── billing/           # Invoices
│   │   ├── account/           # Account settings
│   │   └── reorder/           # Quick reorder
│   ├── api/
│   │   ├── orders/            # GET + POST with Zod validation
│   │   ├── quotes/[id]/accept # PATCH
│   │   ├── quotes/[id]/extend # POST
│   │   └── alerts/[id]/read   # PATCH
│   ├── globals.css            # Grid texture, fonts, animations
│   └── layout.tsx             # Root layout with Sonner toaster
├── components/
│   ├── ui/                    # Badge, Button, Card, StatusPill, ProgressBar, Skeleton
│   ├── layout/                # Topbar, Sidebar, PageHeader
│   └── dashboard/             # KpiCard, ActiveOrdersTable, AlertsFeed
├── lib/
│   ├── types.ts               # All TypeScript types (strict, no any)
│   ├── utils.ts               # cn(), formatDate(), STATUS_CONFIG
│   ├── mock-data.ts           # Complete demo dataset
│   └── supabase/
│       ├── client.ts          # Browser client (@supabase/ssr)
│       └── server.ts          # Server client (cookies)
├── middleware.ts              # Auth guard + demo mode bypass
supabase/
├── migrations/001_schema.sql  # Full schema with RLS
└── seed.sql                   # Demo data
```

---

## RLS Design Decisions

### Company-scoped isolation
Every data table has a `company_id` foreign key. All RLS policies use the helper function:

```sql
CREATE OR REPLACE FUNCTION get_my_company_id()
RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'company_id')::UUID;
$$ LANGUAGE sql STABLE;
```

This reads `company_id` directly from the **JWT `app_metadata` claim** — set server-side when creating users — rather than doing a lookup on every query. This is:
- **Faster**: No extra join/subquery per RLS check
- **Tamper-proof**: `app_metadata` is not editable by the client (unlike `user_metadata`)
- **Scalable**: Works identically across all tables

### Role-based write access
Insert/update operations additionally check `role = 'admin'` from the `users` table, ensuring viewer-role users have read-only access.

### Realtime
`orders` and `alerts` tables are added to `supabase_realtime` publication. Subscribe on the client with:
```ts
supabase.channel('orders')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders',
      filter: `company_id=eq.${companyId}` }, (payload) => {
    // Update UI state
  })
  .subscribe();
```

---

## Features

| Feature | Implementation |
|---|---|
| Dark industrial theme | CSS vars + Tailwind custom palette matching mockup |
| StatusPill | Dot + label, 5 variants (cutting/forming/ready/queue/shipped) |
| Progress bars | Color-coded by status (blue/amber/green/gray) |
| Filter tabs | All / On Floor / Ready on dashboard; all statuses on orders page |
| Skeleton loading | Shimmer animation on all data-fetching components |
| Optimistic UI | Mark-alert-as-read fades instantly without waiting for API |
| Toast notifications | Sonner: order submitted, quote accepted, alert dismissed |
| Mobile sidebar | Collapsible drawer with overlay, hamburger in topbar |
| Zod validation | All API route inputs validated with typed error responses |
| TypeScript strict | `strict: true`, zero `any` types throughout |
| Demo mode | Full functionality without Supabase — uses mock data |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + custom CSS vars
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase Auth (email/password)
- **Realtime**: Supabase `postgres_changes` subscriptions
- **Validation**: Zod
- **Toasts**: Sonner
- **Icons**: Lucide React
- **Fonts**: Barlow Condensed, Barlow, IBM Plex Mono
