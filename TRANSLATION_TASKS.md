# Task: Complete Application Translation

**Goal**: Fully internationalize all remaining pages and components in the application by extracting hardcoded strings into `messages/*.json` files and replacing them with `next-intl` hooks.

**Scope**: Pages, Components, Forms, Admin Panel, and Metadata.

## Phase 1: Authentication & User Pages
- [x] **Login / Register Page** (`src/app/[locale]/login/page.tsx`)
  - [x] Extract: "Welcome Back", "Sign In", "Sign Up", "Don't have an account?", "Already have an account?"
  - [x] Extract Labels/Placeholders: "Email", "Password", "Full Name", "Confirm Password"
- [x] **Profile Page** (`src/app/[locale]/profile/profile-form.tsx`)
  - [x] Extract: "Profile Settings", "Manage your personal information"
  - [x] Extract Fields: "Email", "Full Name", "Phone Number", "Profile Picture"

## Phase 2: Public Marketplace Pages
- [x] **Inventory / Buy Page** (`src/app/[locale]/buy/page.tsx`)
  - [x] Extract: "Browse Inventory", Filter labels, "No cars found"
- [x] **Sell Page** (`src/app/[locale]/sell/page.tsx`)
  - [x] Extract: "Sell Your Car", "This feature is coming soon"
- [x] **Comparison Page** (`src/app/[locale]/compare/page.tsx`)
  - [x] Extract: "Compare Vehicles", "Vehicle Comparison", "You haven't selected any vehicles..."
  - [x] Extract Table Headers: "Feature", "Action", "View Details"
- [x] **Car Details Page** (`src/app/[locale]/car/[id]/page.tsx`)
  - [x] Extract labels from: `DetailedSpecs`, `AmenitiesList`, `MarketInsights`

## Phase 3: Admin Dashboard
- [ ] **Sidebar & Navigation** (`src/components/admin/admin-sidebar.tsx`)
  - [ ] Extract menu items: "Dashboard", "Inventory", "Calendar", "Leads", "Users", "Settings"
- [ ] **Inventory Management** (`src/components/admin/vehicle-form.tsx`)
  - [ ] Extract Form Labels: "Make", "Model", "Year", "Price", "Status", "Mileage", "Transmission", "Fuel Type"
  - [ ] Extract Dropdown Options: "Available", "Reserved", "Sold", "Automatic", "Manual", "Petrol", "Diesel"
- [ ] **Leads & Users** (`src/app/[locale]/admin/leads/page.tsx`, `users-table.tsx`)
  - [ ] Extract Headers: "Leads & Inquiries", "Customer", "Vehicle", "Status", "Date & Time"
  - [ ] Extract Role Labels: "User", "Staff", "Admin"

## Phase 4: Components & Forms
- [ ] **Chat & Booking**
  - [ ] `ChatWidget`: "Type a message...", "Send"
  - [ ] `BookingModal`: "Schedule Test Drive", "Select type", "Select time"
- [ ] **Tools**
  - [ ] `TradeInForm`: Placeholders like "Vehicle Reg", "Mileage"
  - [ ] `FinanceCalculator`: "Loan Amount", "Interest Rate", "Calculate"
- [ ] **Common UI**
  - [ ] Search Inputs: "Search cars..."
  - [ ] Pagination/Carousel: "Previous", "Next"
  - [ ] Dialogs: "Are you sure?", "Cancel", "Confirm"

## Phase 5: Metadata & Zod Schemas
- [ ] **Metadata**: Localize `generateMetadata` titles and descriptions for pages.
- [ ] **Zod Validation**: Translate error messages (e.g., "Email is required", "Password must be at least 8 characters").
