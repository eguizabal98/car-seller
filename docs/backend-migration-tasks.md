# Backend Migration Task List

This document outlines the files containing hardcoded data and the tasks required to connect them to the Supabase backend.

## 1. Homepage Featured Cars (Completed)

**File:** `src/components/home/featured-cars.tsx`

*   **Status:** ✅ Completed
*   **Changes:**
    *   Refactored `FeaturedCars` to accept `cars` prop.
    *   Updated `src/app/page.tsx` to fetch vehicles with `is_featured=true` from Supabase.
    *   Added data transformation to match `Car` interface (including fetching primary media).

## 2. Car Details Page - Media & Specs (Completed)

**File:** `src/app/car/[id]/page.tsx`

*   **Status:** ✅ Completed
*   **Changes:**
    *   Updated `getCar` to fetch related `media` data.
    *   Created migration to add `owners` column to `vehicles` table.
    *   Replaced `mockMedia` with dynamic media mapping (preserving fallback logic for robust rendering).
    *   Updated `generateMetadata` to use dynamic primary image.

## 3. Digital Logbook (Service History) (Completed)

**File:** `src/components/car-details/digital-logbook.tsx`

*   **Status:** ✅ Completed
*   **Changes:**
    *   Created `service_history` table in Supabase.
    *   Updated `DigitalLogbook` component to fetch service records by `vehicleId`.
    *   Added empty state handling and loading state.
    *   Passed `vehicleId` prop from `CarDetailsPage` to `DigitalLogbook`.

## 4. Inventory Filters (Completed)

**File:** `src/components/inventory/filter-sidebar.tsx`

*   **Status:** ✅ Completed
*   **Changes:**
    *   Refactored `FilterSidebar` to accept `makes` as a prop.
    *   Updated `BuyPage` to fetch unique makes from the `vehicles` table.
    *   Populated the "Make" dropdown dynamically with real data.

## 5. Finance Calculator Defaults (Completed)

**File:** `src/components/tools/finance-calculator.tsx`

*   **Status:** ✅ Completed
*   **Changes:**
    *   Created `app_settings` table in Supabase with default finance configuration.
    *   Updated `FinanceCalculator` to fetch defaults (interest rate, terms) from the database on mount.
    *   Added a loading state to the calculator component.

## 6. Placeholder Images

**File:** `src/app/buy/page.tsx` & `src/components/inventory/car-card.tsx`

*   **Current State:** Hardcoded URLs for placeholder images.
*   **Task:**
    *   Upload standard placeholder images to Supabase Storage.
    *   Replace hardcoded URLs with public URLs from Supabase Storage.

## 7. Admin Inventory Management

**File:** `src/app/admin/inventory/page.tsx`

*   **Current State:** The "Featured" switch is disabled and commented as "Mock Switch".
*   **Task:**
    *   Create a client component (e.g., `FeaturedToggle`) to handle the switch interactivity.
    *   Implement a server action or API call to update the `is_featured` column in Supabase when toggled.

---

## Summary of Database Requirements

To complete these tasks, the following database schema updates are likely needed:

1.  **`vehicles` Table Updates:**
    *   Add `is_featured` (boolean)
    *   Add `owners` (integer)
    *   Add `media` (jsonb) OR create separate table.
2.  **`media` Table (Alternative to JSONB):**
    *   `id`, `vehicle_id`, `url`, `type` ('image' | 'video'), `is_primary`
3.  **`service_history` Table:**
    *   `id`, `vehicle_id`, `date`, `description`, `mileage`, `provider`
