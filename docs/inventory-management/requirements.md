# Inventory Management - Edit & Delete Requirements

## 1. Overview
This document outlines the requirements for implementing the "Edit" and "Delete" functionalities within the Admin Inventory module. These features will allow administrators to update vehicle details and remove listings from the platform.

## 2. Scope
The scope includes:
1.  **Edit Page**: A form-based interface to modify existing vehicle data.
2.  **Delete Action**: A secure way to remove a vehicle listing, including a confirmation step.
3.  **Server Actions**: Backend logic to handle database updates and deletions.

## 3. User Stories
*   **As an Admin**, I want to click an "Edit" button on a vehicle in the inventory list so that I can update its price, status, or description.
*   **As an Admin**, I want to be able to upload new photos or remove old ones when editing a vehicle.
*   **As an Admin**, I want to delete a vehicle listing that is no longer needed.
*   **As an Admin**, I want to be asked for confirmation before deleting a vehicle to prevent accidental data loss.

## 4. Technical Requirements

### 4.1. Edit Feature

#### 4.1.1. Route & Page
*   **Route**: `/admin/inventory/[id]`
*   **Component**: Create a reusable `VehicleForm` component.
    *   This component should be capable of handling both "Create" (future) and "Edit" modes.
    *   For "Edit" mode, it must be pre-filled with the vehicle's current data fetched from Supabase.

#### 4.1.2. Form Fields
The form should support editing the following fields (mapping to the `vehicles` table):
*   **Basic Info**: Make, Model, Year, Trim/Version.
*   **Pricing**: Price (numeric), Currency (default USD).
*   **Specs**: Mileage, Transmission (Automatic/Manual), Fuel Type, Color, Body Type.
*   **Status**: Condition (New/Used), Status (Available/Sold/Reserved).
*   **Description**: Rich text or text area for detailed description.
*   **Images**:
    *   Display current images.
    *   Allow uploading new images (storage in Supabase Storage).
    *   Allow deleting existing images.

#### 4.1.3. Server Action (`updateVehicle`)
*   Create a Server Action in `src/app/admin/inventory/actions.ts`.
*   **Input**: `id` (vehicle ID) and `formData` (or a validated object).
*   **Validation**: Use Zod schema to validate inputs.
*   **Logic**:
    *   Update the `vehicles` record in Supabase.
    *   Handle image uploads/deletions if applicable.
    *   `revalidatePath('/admin/inventory')` to refresh the list.
    *   Redirect to `/admin/inventory` on success.

### 4.2. Delete Feature

#### 4.2.1. UI Interaction
*   **Trigger**: The existing "Trash" icon button in the `InventoryPage` table.
*   **Confirmation**:
    *   Clicking the trash icon should open a **Confirmation Dialog** (using `AlertDialog` from shadcn/ui).
    *   Message: "Are you sure you want to delete this vehicle? This action cannot be undone."
    *   Buttons: "Cancel" (close dialog) and "Delete" (confirm action).

#### 4.2.2. Server Action (`deleteVehicle`)
*   Create a Server Action in `src/app/admin/inventory/actions.ts`.
*   **Input**: `id` (vehicle ID).
*   **Logic**:
    *   Delete the record from the `vehicles` table in Supabase.
    *   (Optional but recommended) Clean up associated images from Supabase Storage.
    *   `revalidatePath('/admin/inventory')`.
*   **Feedback**: Show a toast notification (Success/Error) using `sonner`.

## 5. Implementation Steps

1.  **Delete Feature**:
    *   Implement `deleteVehicle` server action.
    *   Wrap the delete button in a Client Component (or use a specialized component) to handle the `AlertDialog` state and call the server action.

2.  **Edit Feature - Preparation**:
    *   Define the Zod schema for vehicle data.
    *   Create the `VehicleForm` component (UI only first).

3.  **Edit Feature - Page**:
    *   Create `src/app/admin/inventory/[id]/page.tsx`.
    *   Fetch vehicle data by ID.
    *   Render `VehicleForm` passing the initial data.

4.  **Edit Feature - Logic**:
    *   Implement `updateVehicle` server action.
    *   Connect the form submission to the server action.
