# Task: Implement Internationalization (i18n)

**Goal**: Enable multi-language support with Spanish (`es`) as the default language and English (`en`) as a secondary option. Include a language selector for users.

**Tech Stack**: `next-intl` (Recommended for Next.js 16 App Router).

**Strategy**: "As-needed" routing (Default language `es` has no prefix, e.g. `/`, while English has `/en`).

## Phase 1: Installation & Setup
- [x] **Install Dependencies**:
  ```bash
  npm install next-intl
  ```
- [x] **Configure Middleware**:
  - Created `src/middleware.ts`.
  - Configured `localePrefix: 'as-needed'`.
- [x] **Configure i18n Request**:
  - Created `src/i18n/request.ts`.
- [x] **Next.js Config**:
  - Updated `next.config.ts`.

## Phase 2: Project Restructuring
- [x] **Directory Structure**:
  - Moved routes to `src/app/[locale]/*`.
- [x] **Root Layout Update**:
  - Updated `src/app/[locale]/layout.tsx` with `NextIntlClientProvider`.

## Phase 3: Translation Management
- [x] **Create Message Files**:
  - Created `messages/es.json`.
  - Created `messages/en.json`.
- [x] **Extract Strings**:
  - `Hero` component updated.
  - `Navbar` component updated.

## Phase 4: UI Components
- [x] **Language Selector**:
  - Created `src/components/ui/language-selector.tsx`.
  - Added to `Navbar`.

## Phase 5: Verification
- [x] **Routing**: Verified structure supports `[locale]`.
