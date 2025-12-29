# Feature Flags Implementation Requirements

## 1. Overview
The goal is to implement a dynamic Feature Flag system that allows Administrators to enable or disable specific modules of the application directly from the Admin Panel without code changes.

## 2. Scope
The following features must be controllable via feature flags:
1.  **Buy**: Controls the "Buy" navigation link and access to inventory pages.
2.  **Sell**: Controls the "Sell" navigation link and access to the "Sell your car" page.
3.  **Finance**: Controls the "Finance" navigation link, the Finance page, and the Finance Calculator widget on the Car Details page.
4.  **About**: Controls the "About" navigation link and access to the About page.
5.  **Footer Pages**: Controls the visibility of specific footer links or sections.

## 3. Database Schema
A new table `feature_flags` will be created in Supabase to persist the state of each feature.

**Table Name:** `feature_flags`

| Column | Type | Description |
| :--- | :--- | :--- |
| `key` | `text` | Primary Key. Unique identifier for the flag (e.g., `feature_buy`, `feature_finance`). |
| `is_enabled` | `boolean` | Current state of the feature. Default: `true`. |
| `description` | `text` | Human-readable description for the Admin UI. |
| `updated_at` | `timestamp` | Last modification time. |
| `updated_by` | `uuid` | Reference to the admin who changed it (optional). |

### Initial Data Seed
*   `buy`: enabled
*   `sell`: enabled
*   `finance`: enabled
*   `about`: enabled
*   `footer`: enabled (controls general footer visibility or specific sections)

## 4. Admin Panel UI
*   **Location**: A new section under **Settings** or a dedicated **Feature Management** page in the Admin Sidebar.
*   **Interface**: A list of features with:
    *   Feature Name (derived from key or description).
    *   Description.
    *   Toggle Switch (Enable/Disable).
    *   Status indicator (Active/Inactive).
*   **Action**: Toggling a switch updates the `feature_flags` table immediately (with optimistic UI updates).

## 5. Implementation Details

### 5.1. Backend / Data Fetching
*   Create a utility function `getFeatureFlags()` to fetch all flags or a specific flag state.
*   Since the app uses Next.js App Router (Server Components), flags should be fetched on the server and passed down or used to determine rendering.

### 5.2. Frontend Integration

#### Navigation Bar (`src/components/layout/navbar.tsx`)
*   Fetch feature flags.
*   Conditionally render `Link` components for Buy, Sell, Finance, and About based on their respective flags.

#### Footer (`src/components/layout/footer.tsx`)
*   Fetch feature flags.
*   Conditionally render footer sections or the entire footer based on configuration.

#### Car Details Page (`src/app/car/[id]/page.tsx`)
*   Check the `finance` flag.
*   If `finance` is disabled, do not render the `FinanceCalculator` component.

#### Route Protection (Middleware or Page Level)
*   **Pages**: `/buy`, `/sell`, `/finance`, `/about`.
*   **Logic**: Even if the link is hidden, the route should be inaccessible.
    *   Implement a check at the top of the `page.tsx` for these routes.
    *   If the flag is disabled, return `notFound()` (404) or redirect to home.

## 6. User Stories
*   **As an Admin**, I want to temporarily disable the "Sell" feature so that we stop receiving new submissions during maintenance.
*   **As an Admin**, I want to hide the "Finance" section if our finance partner API is down.
*   **As a User**, I should not see links to pages that are currently disabled.
*   **As a User**, if I try to navigate to a disabled URL directly, I should see a 404 page.
