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

## 3. Digital Logbook (Service History)

**File:** `src/components/car-details/digital-logbook.tsx`

*   **Current State:** Completely hardcoded JSX rendering "Major Service" and "Interim Service" entries.
*   **Task:**
    *   Create a `service_history` table in Supabase:
        *   `id` (uuid)
        *   `vehicle_id` (uuid, foreign key)
        *   `date` (date)
        *   `service_type` (text)
        *   `description` (text)
        *   `provider` (text) - e.g., "Porsche Centre London"
        *   `mileage` (int)
    *   Fetch this data based on the current vehicle ID.
    *   Map the fetched data to the service history UI.

## 4. Inventory Filters

**File:** `src/components/inventory/filter-sidebar.tsx`

*   **Current State:** Hardcoded options for "Make" (Porsche, Mercedes-Benz, etc.) and "Lifestyle" tags.
*   **Task:**
    *   **Makes:** Fetch distinct `make` values from the `vehicles` table to populate the dropdown dynamically.
    *   **Lifestyle:** Fetch distinct tags from a `tags` column or a separate `tags` table if "Lifestyle" is a dynamic feature.

## 5. Finance Calculator Defaults

**File:** `src/components/tools/finance-calculator.tsx`

*   **Current State:** Default interest rate (6.9%) and terms are hardcoded.
*   **Task:** (Optional/Low Priority)
    *   Store global finance settings (default APR, min/max deposit) in a `app_settings` or `config` table in Supabase.
    *   Fetch these defaults on component mount.

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
