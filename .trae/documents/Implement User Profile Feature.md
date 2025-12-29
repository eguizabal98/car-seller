I will implement the User Profile feature, allowing authenticated users to view and update their personal information.

### 1. Backend Implementation (Server Actions)
*   **Create `src/app/profile/actions.ts`**:
    *   `getProfile`: Securely fetch the current user's profile data (Full Name, Phone, Avatar URL) from the `profiles` table.
    *   `updateProfile`: Allow users to update their `full_name`, `phone_number`, and `avatar_url`.
    *   *Note*: Since file storage is not yet configured, the avatar update will support text URL input for now.

### 2. Frontend Implementation (Profile Page)
*   **Create `src/app/profile/page.tsx`**:
    *   A protected page (redirects to login if unauthenticated).
    *   **UI Components**:
        *   **Header**: Display user's current avatar and email.
        *   **Profile Form**:
            *   **Full Name**: Text input.
            *   **Phone Number**: Text input.
            *   **Avatar URL**: Text input (placeholder for future upload feature).
            *   **Email**: Read-only field.
        *   **Save Button**: Submits changes via the server action with loading state and success/error notifications (using `sonner`).

### 3. Navigation Updates
*   **Update `src/components/layout/navbar.tsx`**:
    *   **Desktop Menu**: Change the "Profile" DropdownMenuItem to a `Link` pointing to `/profile`.
    *   **Mobile Menu**: Add a "Profile" link in the mobile drawer for easy access.

### 4. Verification
*   **Manual Test**:
    *   Log in as a user.
    *   Navigate to `/profile` via the navbar.
    *   Update name and phone number.
    *   Refresh to verify persistence.
