# Feature Flags System Design

## 1. Introduction
This document outlines the technical design for the Feature Flags system. The system enables dynamic control over application modules (Buy, Sell, Finance, About, Footer) without code deployment.

## 2. Architecture Overview
The system leverages **Supabase** for persistence, **Next.js Server Actions** for mutation, and **Next.js Cache** for high-performance reading.

### Data Flow
1.  **Read**: Application (Server/Client) -> Next.js Cache -> Supabase DB.
2.  **Write**: Admin Panel -> Server Action -> Supabase DB -> Revalidate Cache.

## 3. Database Design

### Schema
A new table `feature_flags` in the `public` schema.

```sql
create table public.feature_flags (
  key text primary key, -- e.g., 'buy', 'sell'
  is_enabled boolean default true not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users(id)
);

-- Indexes
create index feature_flags_key_idx on public.feature_flags (key);
```

### Security (RLS)
*   **Select**: Public (Everyone can read feature flags).
*   **Insert/Update/Delete**: Admin only.

```sql
alter table feature_flags enable row level security;

create policy "Allow public read access"
  on feature_flags for select
  using (true);

create policy "Allow admin update access"
  on feature_flags for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role in ('ADMIN', 'STAFF')
    )
  );
```

### Initial Seed Data
```sql
insert into feature_flags (key, description, is_enabled) values
  ('buy', 'Enable inventory browsing and purchasing', true),
  ('sell', 'Enable sell your car flow', true),
  ('finance', 'Enable finance calculator and pages', true),
  ('about', 'Enable about page', true),
  ('footer', 'Enable global footer', true);
```

## 4. Backend Implementation

### Data Access Layer (`src/lib/features.ts`)

We will use `unstable_cache` (or `fetch` with tags) to cache the flags and avoid hitting the DB on every request.

```typescript
// src/lib/features.ts
import { createClient } from '@/utils/supabase/server';
import { unstable_cache } from 'next/cache';

export type FeatureFlag = {
  key: string;
  isEnabled: boolean;
  description: string;
};

export const getFeatureFlags = unstable_cache(
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('feature_flags').select('*');
    if (error) throw error;
    return data;
  },
  ['feature-flags'],
  { tags: ['feature-flags'], revalidate: 3600 }
);

export async function isFeatureEnabled(key: string): Promise<boolean> {
  const flags = await getFeatureFlags();
  const flag = flags.find(f => f.key === key);
  return flag?.is_enabled ?? false; // Default to false if missing for safety
}
```

### Mutations (`src/app/admin/settings/actions.ts`)

```typescript
'use server'

import { revalidateTag } from 'next/cache';

export async function toggleFeatureFlag(key: string, isEnabled: boolean) {
  // 1. Auth check (Admin only)
  // 2. Update DB
  // 3. Revalidate cache
  revalidateTag('feature-flags');
}
```

## 5. Frontend Architecture

### Global State Strategy
Since feature flags are needed globally (Navbar, Footer, Pages), we will fetch them once in the **Root Layout** and pass them to a Client Context Provider. This avoids prop drilling and allows Client Components to access flags easily.

#### 1. Context Provider (`src/providers/feature-flag-provider.tsx`)
```tsx
'use client';

const FeatureFlagContext = createContext<Record<string, boolean>>({});

export function FeatureFlagProvider({ 
  children, 
  initialFlags 
}: { 
  children: React.ReactNode, 
  initialFlags: FeatureFlag[] 
}) {
  const flagsMap = useMemo(() => 
    initialFlags.reduce((acc, flag) => ({ ...acc, [flag.key]: flag.is_enabled }), {}), 
  [initialFlags]);

  return (
    <FeatureFlagContext.Provider value={flagsMap}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export const useFeature = (key: string) => {
  const context = useContext(FeatureFlagContext);
  return context[key] ?? false;
}
```

#### 2. Root Layout Integration (`src/app/layout.tsx`)
```tsx
import { getFeatureFlags } from '@/lib/features';

export default async function RootLayout({ children }) {
  const flags = await getFeatureFlags();
  return (
    <html>
      <body>
        <FeatureFlagProvider initialFlags={flags}>
          {children}
        </FeatureFlagProvider>
      </body>
    </html>
  )
}
```

## 6. Component Integration

### Navigation (`Navbar.tsx`)
Use `useFeature()` hook to conditionally render links.

```tsx
const { buy, sell, finance, about } = useFeature();

return (
  <nav>
    {buy && <Link href="/buy">Buy</Link>}
    {sell && <Link href="/sell">Sell</Link>}
    ...
  </nav>
)
```

### Route Protection (`src/app/(public)/[feature]/page.tsx`)
For server-side pages, use `isFeatureEnabled` directly.

```tsx
// src/app/finance/page.tsx
import { isFeatureEnabled } from '@/lib/features';
import { notFound } from 'next/navigation';

export default async function FinancePage() {
  if (!await isFeatureEnabled('finance')) {
    return notFound();
  }
  // ... content
}
```

## 7. Admin Panel UI

### Page: `src/app/admin/settings/features/page.tsx`
*   **Layout**: Table or List view.
*   **Columns**: Feature Name, Description, Status (Toggle).
*   **Interaction**: `Switch` component triggers `toggleFeatureFlag` server action.

## 8. Testing Strategy
1.  **Unit Tests**: Mock `useFeature` hook to verify components hide/show correctly.
2.  **E2E Tests (Playwright)**:
    *   Login as Admin -> Disable 'Sell'.
    *   Verify 'Sell' link is gone from Navbar.
    *   Navigate to `/sell` -> Verify 404.
    *   Enable 'Sell' -> Verify link returns.
