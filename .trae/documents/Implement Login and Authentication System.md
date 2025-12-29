I will implement the authentication system for both users and admins.

### 1. Create Authentication Logic (`src/app/login/actions.ts`)
- Implement `login` Server Action:
  - Authenticate with Supabase.
  - Check the user's role in the `profiles` table.
  - Return the appropriate redirect URL (`/admin/inventory` for admins/staff, `/` for normal users).
- Implement `signup` Server Action:
  - Register new users with Supabase.
  - Pass `full_name` metadata (which triggers the profile creation in the database).

### 2. Create Login Page (`src/app/login/page.tsx`)
- Build a responsive authentication page using existing UI components (`Card`, `Tabs`, `Input`, `Button`).
- Implement two tabs: "Sign In" and "Sign Up".
- Use `react-hook-form` and `zod` for form validation.
- Integrate with the server actions created above.
- Add error handling and success notifications using `sonner`.

### 3. Protect Admin Routes (`src/middleware.ts`)
- Update the middleware to check for authentication on `/admin` routes.
- Verify user roles: Redirect non-admin users attempting to access admin pages back to the home page or login page.

### 4. Verify Integration
- Ensure the Navbar correctly updates state upon login/logout.
- Verify redirection logic for both user types.
