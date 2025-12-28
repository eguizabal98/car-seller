# Tech Stack Documentation

## Core Architecture
- **Frontend Framework**: Next.js (App Router)
  - Selected for: SEO capabilities (critical for listings), performance, and server-side rendering.
- **Language**: TypeScript
  - Selected for: Type safety and developer experience.
- **Backend & Infrastructure**: Supabase
  - **Project Dashboard**: [https://supabase.com/dashboard/project/cnayqnkvvqohmbuiwtig](https://supabase.com/dashboard/project/cnayqnkvvqohmbuiwtig)

## Detailed Stack Breakdown

### 1. Frontend Layer
- **Framework**: Next.js
- **Styling**: Tailwind CSS
  - Utility-first approach for rapid, mobile-first development.
- **UI Component Library**: Shadcn/UI (based on Radix UI)
  - Accessible, customizable components for a premium feel ("Digital Showroom").
- **State Management**:
  - **Server State**: TanStack Query (React Query) - for caching and syncing with Supabase.
  - **Client State**: Zustand - for global UI state (e.g., filters, trade-in modal state).
- **Forms**: React Hook Form + Zod
  - For robust form validation (e.g., trade-in forms, contact forms).

### 2. Backend Layer (Supabase)
- **Database**: PostgreSQL
  - Relational data for cars, users, bookings, and chat messages.
- **Authentication**: Supabase Auth
  - Secure login, social auth, and Row Level Security (RLS) policies.
- **Storage**: Supabase Storage
  - Hosting for high-resolution 4K images, 360° viewer assets, and inspection PDFs.
- **Realtime**: Supabase Realtime
  - Powering the "Integrated Live Chat" and status updates (e.g., car marked as "Reserved").
- **Edge Functions**: Supabase Edge Functions (Deno)
  - For backend logic like trade-in valuations, sending emails, or secure 3rd party API calls.

### 3. Integrations & Services
- **Video**: YouTube Embeds
  - Store video URLs in Supabase; embed players in the frontend.
- **Scheduling**: Custom In-House Solution
  - Built with Supabase Database (booking tables) & Realtime for slot availability.
- **Communication**: WhatsApp Business API
  - For the "Quick Chat" integration.
- **Maps**: Google Maps Platform / Mapbox
  - For dealership location and searching by distance.

### 4. DevOps & Tooling
- **Version Control**: Git
- **Deployment**: Vercel (Recommended for Next.js)
- **Linting & Formatting**: ESLint + Prettier
