# Car Seller - Automotive Marketplace Platform

## Overview
Car Seller is a modern, feature-rich automotive marketplace built with Next.js 16. It is designed to streamline the car buying and selling process, offering a seamless experience for potential buyers and efficient management tools for dealerships.

## Key Features

### For Buyers
*   **Smart Inventory Search**: Advanced filtering system to find cars by make, model, price, year, and more.
*   **Detailed Vehicle Listings**: Comprehensive car details including specifications, digital logbook, and high-quality media galleries.
*   **Comparison Tool**: Floating comparison bar allowing users to side-by-side compare specifications of multiple vehicles.
*   **Financial Tools**: Integrated finance calculator to estimate monthly payments based on interest rates and loan terms.
*   **Trade-In Valuation**: Easy-to-use trade-in form for users to get estimates on their current vehicle's value.
*   **Interactive Engagement**:
    *   Direct WhatsApp integration for instant communication.
    *   In-app chat widget.
    *   Test drive booking system.

### For Administrators
*   **Dashboard**: Centralized admin panel for managing platform operations.
*   **Inventory Management**: Tools to add, edit, and remove vehicle listings.
*   **Lead Management**: System to track and manage potential buyer inquiries and test drive requests.

## Technical Architecture

### Frontend
*   **Framework**: Next.js 16 (App Router) & React 19
*   **Language**: TypeScript
*   **State Management**: Zustand
*   **Styling**: Tailwind CSS 4
*   **UI Components**: Radix UI primitives, Lucide Icons, Sonner for notifications, Embla Carousel
*   **Forms**: React Hook Form with Zod validation

### Backend & Infrastructure
*   **Database & Auth**: Supabase (PostgreSQL)
*   **Deployment**: Vercel-ready configuration

### Quality Assurance
*   **Testing**: End-to-end testing with Playwright

## Project Structure
The project follows a modular architecture:
*   `src/app`: App Router pages for public and admin views.
*   `src/components`: Reusable UI components organized by feature (inventory, booking, finance, etc.).
*   `src/store`: Global state management.
*   `src/utils/supabase`: Database client and middleware configuration.
