# Admin Calendar Feature Requirements

## 1. Overview
The Admin Calendar feature provides a centralized visual interface for administrators to manage vehicle test drives and video walkthrough appointments. This feature aims to streamline the lead management process by offering a calendar-based view of all bookings, allowing for efficient scheduling and status updates.

## 2. Goals
*   **Visualize Schedule**: Provide a clear monthly, weekly, and daily view of upcoming appointments.
*   **Efficient Management**: Allow quick status updates (Confirm, Cancel, Complete) for bookings.
*   **Contextual Information**: Display detailed booking info (customer, vehicle) within the calendar context.

## 3. User Stories
*   **As an Admin**, I want to see a calendar view of all bookings so I can understand my daily and weekly schedule.
*   **As an Admin**, I want to filter bookings by status (e.g., Pending, Confirmed) and type (Test Drive, Video Walkthrough).
*   **As an Admin**, I want to click on a booking slot to view the full details, including customer contact info and vehicle specifications.
*   **As an Admin**, I want to update the status of a booking directly from the calendar view.
*   **As an Admin**, I want to navigate between months and weeks easily.

## 4. Functional Requirements

### 4.1. Calendar Interface
*   **Route**: `/admin/calendar`
*   **Views**:
    *   **Month View**: High-level overview showing indicators for days with bookings.
    *   **Day/Agenda View**: Detailed hourly timeline for a selected day.
*   **Navigation**:
    *   Next/Previous controls for Month/Day.
    *   "Today" quick navigation button.
*   **Indicators**:
    *   Color-coded events based on status (e.g., Yellow: Pending, Green: Confirmed, Red: Cancelled, Blue: Completed).
    *   Icons to differentiate between "Test Drive" and "Video Walkthrough" (using Lucide Icons).

### 4.2. Booking Details & Actions
*   **Quick View**: Hovering or clicking an event shows a summary (Time, Customer Name, Vehicle).
*   **Detail Modal**: Clicking an event opens a Dialog (Radix UI) with:
    *   **Customer**: Name, Email, Phone (from `profiles` table).
    *   **Vehicle**: Image, Make, Model, Year, Price (from `vehicles` table).
    *   **Booking Info**: Date, Time, Type, Current Status, User Notes.
*   **Actions**:
    *   **Update Status**: Ability to change status to Confirmed, Cancelled, or Completed.
    *   **Notifications**: Trigger toast notifications (Sonner) upon successful updates.

### 4.3. Integration
*   **Data Source**: Fetch data from Supabase `bookings` table.
*   **Real-time**: (Optional) Listen for real-time updates using Supabase subscriptions if multiple admins are working.

## 5. Technical Specifications

### 5.1. Tech Stack Alignment
*   **Framework**: Next.js 16 (App Router).
*   **Language**: TypeScript.
*   **Styling**: Tailwind CSS 4.
*   **Icons**: Lucide React.
*   **Components**:
    *   Use `src/components/ui/calendar.tsx` (react-day-picker) for the date picker/navigation.
    *   Implement the daily schedule view using CSS Grid/Flexbox or a lightweight scheduling library compatible with React 19 (e.g., `react-big-calendar` if compatible, otherwise custom implementation to avoid dependency issues).
*   **State**: React Query (or standard `useEffect`/`useState` if not using Query) + Zustand if global state is needed.

### 5.2. Data Model
*   **Table**: `bookings`
*   **Fields to Fetch**:
    *   `id`, `booking_date`, `time_slot`, `status`, `type`, `notes`
    *   `profiles (full_name, email, phone_number)`
    *   `vehicles (make, model, year, image_url)`

### 5.3. Directory Structure
```
src/app/admin/calendar/
├── page.tsx                # Main page component
├── layout.tsx              # (Optional) Layout if needed
└── components/
    ├── calendar-view.tsx   # Main calendar grid/list
    ├── booking-event.tsx   # Individual event card
    ├── booking-detail.tsx  # Modal/Dialog for details
    └── calendar-toolbar.tsx # Navigation and filters
```

## 6. Design & UX
*   **Responsiveness**: The calendar should be responsive. On mobile, the "Month" view might switch to a "List" view or simplified "Day" view.
*   **Theme**: Support Dark/Light mode consistent with the rest of the application (Next Themes).

## 7. Acceptance Criteria
*   [ ] Admin can navigate to `/admin/calendar`.
*   [ ] Calendar displays bookings correctly for the current month.
*   [ ] Admin can switch to a specific day to see hourly slots.
*   [ ] Bookings are color-coded by status.
*   [ ] Clicking a booking opens a modal with correct details.
*   [ ] Updating a booking status reflects immediately on the UI and persists to Supabase.
