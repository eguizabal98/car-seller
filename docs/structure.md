# Project Structure & Conventions

## Directory Structure

The project follows a standard Next.js App Router structure with the `src` directory convention.

```
/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── admin/          # Admin dashboard routes
│   │   ├── (public)/       # Public facing routes (implied root)
│   │   ├── api/            # API routes (if any)
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ui/             # Reusable UI primitives (buttons, inputs, etc.)
│   │   ├── [feature]/      # Feature-specific components (e.g., inventory, booking)
│   │   └── layout/         # Layout components (Navbar, Footer)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries and helpers
│   ├── store/              # Global state management (Zustand)
│   └── utils/              # External service utilities (Supabase, etc.)
├── supabase/               # Supabase configuration and migrations
├── tests/                  # End-to-end tests
└── [config files]          # Root configuration files
```

## Naming Conventions

### Files and Directories
*   **Case**: Kebab-case (e.g., `car-card.tsx`, `comparison-store.ts`).
*   **Extensions**:
    *   `.tsx` for React components.
    *   `.ts` for utilities, hooks, and types.
    *   `.css` for stylesheets.

### Components
*   **Definition**: PascalCase (e.g., `function CarCard()`).
*   **Export**: Named exports are preferred over default exports for components to ensure consistent naming on import.
    *   *Exception*: Next.js Pages (`page.tsx`) and Layouts (`layout.tsx`) must use `export default`.

### Variables and Functions
*   **Case**: CamelCase (e.g., `const currentPrice`, `function calculateTotal()`).
*   **Booleans**: Prefix with `is`, `has`, or `should` (e.g., `isLoading`, `hasError`).

## Coding Conventions

### React & Next.js
*   **Functional Components**: Use functional components with hooks.
*   **Server Components**: By default, components in `app/` are Server Components. Add `'use client'` at the top of the file for Client Components (state, effects, interactivity).
*   **Props Interface**: Define props interfaces explicitly, typically named `[ComponentName]Props`.

### Styling (Tailwind CSS)
*   **Utility First**: Use Tailwind utility classes for styling.
*   **Conditional Classes**: Use the `cn()` utility (from `@/lib/utils`) for conditional class merging and conflict resolution (clsx + tailwind-merge).
    ```tsx
    <div className={cn("base-class", condition && "active-class", className)} />
    ```
*   **Responsiveness**: Use Tailwind's responsive prefixes (e.g., `md:flex`, `lg:w-1/2`).

### State Management (Zustand)
*   **Store Definition**: Stores are defined in `src/store/` using `create`.
*   **Persistence**: Use `persist` middleware for state that should survive reloads (e.g., comparison list).
*   **Access**: Use the hook directly in components (e.g., `const { cars } = useComparisonStore()`).

### Database & Auth (Supabase)
*   **Client Creation**: Use `createBrowserClient` for client-side and helper functions for server-side.
*   **Location**: Supabase utilities are located in `src/utils/supabase/`.
*   **Migrations**: After creating a new migration file in `supabase/migrations/`, run `npx supabase db push` to apply changes to the remote database.

### Imports
*   **Path Aliases**: Use `@/` to import from the `src` directory.
    *   `@/components/...`
    *   `@/lib/...`
    *   `@/utils/...`
*   **Order**:
    1.  External libraries (React, Next.js, etc.)
    2.  Internal aliases (`@/...`)
    3.  Relative imports (`./...`) - avoid if possible
    4.  Styles (`./globals.css`)

## Testing
*   **Framework**: Playwright for End-to-End (E2E) testing.
*   **Location**: Tests are located in the `tests/` directory.
*   **Naming**: Test files should end with `.spec.ts`.

## Documentation
*   **Location**: Project documentation resides in the `docs/` directory.
*   **Format**: Markdown (`.md`).
