# Feature Flags Implementation Checklist

This checklist tracks the implementation of the Feature Flags system as defined in [requirements/feature-flags.md](../requirements/feature-flags.md) and [design/feature-flags.md](../design/feature-flags.md).

## Phase 1: Database & Backend Core

- [x] **1.1. Database Migration**
    - [x] Create a new Supabase migration file.
    - [x] Define `feature_flags` table (key, is_enabled, description, updated_at, updated_by).
    - [x] Add RLS policies (Public Read, Admin Write).
    - [x] Add initial seed data (buy, sell, finance, about, footer).
    - [x] Apply migration (`npx supabase db push`).

- [x] **1.2. Data Access Layer**
    - [x] Create `src/lib/features.ts`.
    - [x] Implement `getFeatureFlags` with `unstable_cache` and tagging.
    - [x] Implement `isFeatureEnabled` helper.

- [x] **1.3. Server Actions**
    - [x] Create `src/app/admin/settings/actions.ts` (or `features-actions.ts`).
    - [x] Implement `toggleFeatureFlag` action with permission checks and cache revalidation (`revalidateTag`).

## Phase 2: Frontend Architecture

- [x] **2.1. Context Provider**
    - [x] Create `src/providers/feature-flag-provider.tsx`.
    - [x] Implement `FeatureFlagContext`.
    - [x] Implement `FeatureFlagProvider` component.
    - [x] Export `useFeature` hook.

- [x] **2.2. Global Integration**
    - [x] Update `src/app/layout.tsx`.
    - [x] Fetch flags server-side using `getFeatureFlags`.
    - [x] Wrap application in `FeatureFlagProvider`.

## Phase 3: UI Component Integration

- [x] **3.1. Navigation Bar**
    - [x] Modify `src/components/layout/navbar.tsx`.
    - [x] Use `useFeature` to conditionally render `Buy`, `Sell`, `Finance`, `About` links.

- [x] **3.2. Footer**
    - [x] Modify `src/components/layout/footer.tsx`.
    - [x] Use `useFeature` to conditionally render the footer or specific sections.

- [x] **3.3. Car Details Page**
    - [x] Modify `src/app/car/[id]/page.tsx`.
    - [x] Check `finance` flag.
    - [x] Conditionally render `FinanceCalculator`.

## Phase 4: Route Protection (Server-Side)

- [x] **4.1. Buy Pages**
    - [x] Add check to `src/app/(public)/buy/page.tsx` (if exists) or inventory pages.
    - [x] Redirect/404 if disabled.

- [x] **4.2. Sell Page**
    - [x] Add check to `src/app/(public)/sell/page.tsx`.
    - [x] Redirect/404 if disabled.

- [x] **4.3. Finance Page**
    - [x] Add check to `src/app/(public)/finance/page.tsx`.
    - [x] Redirect/404 if disabled.

- [x] **4.4. About Page**
    - [x] Add check to `src/app/(public)/about/page.tsx`.
    - [x] Redirect/404 if disabled.

## Phase 5: Admin Management UI

- [ ] **5.1. Admin Route**
    - [ ] Create `src/app/admin/settings/features/page.tsx`.
    - [ ] Add link to Sidebar `src/components/admin/admin-sidebar.tsx` (under Settings or as top-level).

- [ ] **5.2. Management Interface**
    - [ ] Fetch flags in the Admin Page.
    - [ ] Render a list/table of features.
    - [ ] Implement `Switch` toggles connected to `toggleFeatureFlag` server action.
    - [ ] Add optimistic updates (optional but recommended).

## Phase 6: Verification & Cleanup

- [ ] **6.1. Manual Testing**
    - [ ] Verify Admin can toggle all flags.
    - [ ] Verify Navbar links disappear/appear immediately.
    - [ ] Verify direct URL access throws 404 when disabled.
    - [ ] Verify Finance Calculator hides when Finance is disabled.

- [ ] **6.2. Code Quality**
    - [ ] Run `npm run lint`.
    - [ ] Ensure types are strict.
