# Admin Calendar Implementation Tasks

This checklist tracks the implementation progress for the Admin Calendar feature based on the [Requirements](./requirements.md) and [Design](./design.md).

## Phase 1: Setup & Foundation
- [x] **Create Directory Structure**
    - Create `src/app/admin/calendar/` directory.
    - Create `src/components/admin/calendar/` directory.
- [x] **Dependencies Check**
    - Verify `date-fns` is installed.
    - Verify `lucide-react` is installed.
    - Verify `sonner` is installed.
- [x] **Page Skeleton**
    - Create `src/app/admin/calendar/page.tsx` (Server Component) with metadata.
    - Create `src/components/admin/calendar/calendar-shell.tsx` (Client Component) with basic layout.

## Phase 2: Core Components
- [x] **Calendar Toolbar**
    - Create `src/components/admin/calendar/calendar-toolbar.tsx`.
    - Implement navigation (Previous, Next, Today).
    - Implement View Mode toggle (Month/Day).
- [x] **Booking Event Card**
    - Create `src/components/admin/calendar/booking-event-card.tsx`.
    - Define props interface (booking object).
    - Apply conditional styling based on booking status (Pending, Confirmed, Cancelled, Completed).
    - Add icons for booking type (Test Drive vs Video).

## Phase 3: Views Implementation
- [x] **Month View**
    - Create `src/components/admin/calendar/month-view.tsx`.
    - Implement 7-column grid layout.
    - Map days of the current month.
    - Filter and render `BookingEventCard`s for each day.
- [x] **Day View**
    - Create `src/components/admin/calendar/day-view.tsx`.
    - Implement hourly time slots (e.g., 8:00 AM - 6:00 PM).
    - Place bookings in appropriate time slots.

## Phase 4: Data Integration
- [x] **Data Fetching Hook**
    - Implement data fetching logic inside `CalendarShell` or a custom hook `useBookings`.
    - Query Supabase `bookings` table with `gte` and `lte` filters for the visible date range.
    - Include relations: `vehicle` and `profile`.
- [x] **Booking Detail Dialog**
    - Create `src/components/admin/calendar/booking-detail-dialog.tsx` using Radix UI Dialog.
    - Display Customer Details (Name, Contact).
    - Display Vehicle Details (Image, Make, Model).
    - Display Booking Details (Date, Time, Notes).
- [x] **Status Updates**
    - Implement `updateBookingStatus` function calling Supabase.
    - Connect "Confirm", "Cancel", "Complete" buttons in the dialog.
    - Add optimistic updates or re-fetching on success.
    - Add `sonner` toast notifications for success/error.

## Phase 5: Refinement & QA
- [x] **Loading & Empty States**
    - Add skeletons while fetching data.
    - Handle days with no bookings gracefully.
- [x] **Responsiveness**
    - Ensure Month View collapses or scrolls horizontally on mobile.
    - Ensure Day View is readable on smaller screens.
- [x] **Final Verification**
    - Verify all Acceptance Criteria from requirements.
    - Check Dark Mode compatibility.
