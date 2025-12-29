# Admin Calendar Feature Design

## 1. Introduction
This document outlines the technical design and implementation details for the Admin Calendar feature. The goal is to provide a visual management tool for vehicle test drives and video walkthroughs, integrated into the existing admin dashboard.

## 2. Architecture & Component Hierarchy

The feature will use a **Hybrid Server/Client** approach to leverage Next.js App Router capabilities while ensuring a responsive, interactive user experience.

### 2.1. Route Structure
*   **Path**: `/admin/calendar`
*   **File**: `src/app/admin/calendar/page.tsx` (Server Component)
    *   Responsible for initial metadata and layout structure.
    *   Wraps the main client-side logic.

### 2.2. Component Tree
```mermaid
graph TD
    Page[Page (Server)] --> Shell[CalendarShell (Client)]
    Shell --> Toolbar[CalendarToolbar]
    Shell --> ViewSwitch{View Mode}
    ViewSwitch -- Month --> MonthView[MonthView]
    ViewSwitch -- Day --> DayView[DayView]
    MonthView --> Event[BookingEventCard]
    DayView --> Event
    Shell --> Dialog[BookingDetailDialog]
```

### 2.3. Key Components
1.  **`CalendarShell` (`src/components/admin/calendar/calendar-shell.tsx`)**
    *   **Role**: Main container and state manager.
    *   **State**: `currentDate` (Date), `viewMode` ('month' | 'day'), `selectedBooking` (Booking | null).
    *   **Logic**: Handles data fetching (via Supabase client) based on the current date range.

2.  **`CalendarToolbar` (`src/components/admin/calendar/calendar-toolbar.tsx`)**
    *   **Role**: Navigation and filtering.
    *   **Props**: `currentDate`, `onDateChange`, `viewMode`, `onViewModeChange`.
    *   **UI**: "Previous", "Today", "Next" buttons; View toggle; Month/Year label.

3.  **`MonthView` (`src/components/admin/calendar/month-view.tsx`)**
    *   **Role**: Standard 7-column grid view.
    *   **Logic**: Renders a grid of days. each cell contains a list of `BookingEventCard`s.
    *   **Interaction**: Clicking a "more" button or a specific day header switches to Day View.

4.  **`DayView` (`src/components/admin/calendar/day-view.tsx`)**
    *   **Role**: Vertical hourly timeline (e.g., 8 AM - 6 PM).
    *   **Logic**: Maps bookings to time slots. Handles overlap visually if necessary.

5.  **`BookingEventCard` (`src/components/admin/calendar/booking-event-card.tsx`)**
    *   **Role**: Minimal representation of a booking.
    *   **Props**: `booking` object.
    *   **Visuals**: Background color based on status, Icon based on type.

6.  **`BookingDetailDialog` (`src/components/admin/calendar/booking-detail-dialog.tsx`)**
    *   **Role**: View and edit booking details.
    *   **UI**: Uses `Radix UI Dialog`. Displays Customer info, Vehicle info, and Status actions.
    *   **Actions**: "Confirm", "Cancel", "Complete" buttons that trigger server actions or API calls.

## 3. Data Management

### 3.1. Data Fetching strategy
Since the calendar requires frequent navigation without full page reloads, we will use **Client-side fetching with Supabase** inside `CalendarShell`.

*   **Hook**: `useBookings(startDate, endDate)`
*   **Query**:
    ```typescript
    supabase
      .from('bookings')
      .select('*, vehicle:vehicles(*), user:profiles(*)')
      .gte('booking_date', startDate)
      .lte('booking_date', endDate)
    ```
*   **Caching**: We can use `swr` or `react-query` if available, or simple `useEffect` with local state for MVP. given the stack, standard `useEffect` + `useState` is sufficient for the initial version, or `tanstack-query` if we want robust caching.

### 3.2. Mutations (Status Updates)
*   **Action**: `updateBookingStatus(id: string, status: BookingStatus)`
*   **Implementation**:
    1.  Call Supabase `update`.
    2.  On success, trigger a local state update (optimistic or refetch).
    3.  Show `sonner` toast notification.

## 4. UI/UX Design

### 4.1. Color Coding (Tailwind Classes)
*   **Pending**: `bg-yellow-100 text-yellow-800 border-yellow-200` (Dark: `bg-yellow-900/30 text-yellow-300`)
*   **Confirmed**: `bg-green-100 text-green-800 border-green-200` (Dark: `bg-green-900/30 text-green-300`)
*   **Cancelled**: `bg-red-100 text-red-800 border-red-200` (Dark: `bg-red-900/30 text-red-300`)
*   **Completed**: `bg-blue-100 text-blue-800 border-blue-200` (Dark: `bg-blue-900/30 text-blue-300`)

### 4.2. Layouts
*   **Month Grid**:
    *   CSS Grid: `grid-cols-7`.
    *   Min-height for cells to ensure uniform look.
*   **Day Timeline**:
    *   Flex column.
    *   Time slots as rows (h-16 or similar).
    *   Absolute positioning for events based on start time? Or simple bucket slotting since slots are fixed (e.g., 1 hour). *Decision*: Simple bucket slotting based on `time_slot` field is easier and matches current data model.

### 4.3. Icons (Lucide)
*   **Test Drive**: `Car` icon.
*   **Video Walkthrough**: `Video` icon.

## 5. Integration Steps

1.  **Database**: Ensure `bookings` table policies allow Admin read/write.
2.  **Dependencies**:
    *   `date-fns`: For date manipulation (start/end of month, formatting).
    *   `lucide-react`: Already installed.
    *   `sonner`: Already installed.
3.  **Implementation Order**:
    1.  Create `CalendarShell` and basic layout.
    2.  Implement `MonthView` logic and rendering.
    3.  Integrate Data Fetching.
    4.  Implement `BookingDetailDialog`.
    5.  Add `DayView`.
    6.  Polish UI and responsiveness.

## 6. Edge Cases & Error Handling
*   **No Data**: Show empty state for days with no bookings.
*   **Loading**: Skeleton loader for grid cells while fetching.
*   **Error**: Toast notification if fetch fails.
*   **Timezone**: Assume local browser time for display, but store/transfer dates effectively. *Note*: `booking_date` is likely just a date string, `time_slot` a string. We will treat them as "local dealership time".

