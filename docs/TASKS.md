# Implementation Roadmap

This document outlines the step-by-step plan to build the High-End Second-Hand Car Marketplace, based on the [PRD](PRD.md) and [Tech Stack](TECH_STACK.md).

## Phase 1: Project Initialization & Infrastructure
- [x] **Initialize Next.js Project**
    - Setup Next.js 14+ (App Router) with TypeScript.
    - Configure Tailwind CSS.
    - Initialize Git repository.
- [x] **UI Component Setup**
    - Install Shadcn/UI CLI.
    - Configure base theme (fonts, colors for "High-End" feel).
    - Install core components (Buttons, Inputs, Cards, Dialogs).
- [x] **Supabase Setup**
    - Connect to project: `cnayqnkvvqohmbuiwtig`.
    - Setup local development environment (Supabase CLI).
    - Configure environment variables.

## Phase 2: Database & Backend Design
- [x] **Database Schema Design**
    - `users` (extend auth.users).
    - `vehicles` (details, specs, status, price).
    - `media` (images, video URLs, hotspots).
    - `bookings` (for test drives/visits).
    - `chat_rooms` & `messages`.
- [x] **Supabase Configuration**
    - Set up Storage buckets (images, documents).
    - Configure Row Level Security (RLS) policies.
    - Set up Realtime subscriptions for Chat and Status updates.

## Phase 3: Core Buyer Experience (Discovery)
- [x] **Global Layout**
    - Navbar (Logo, Search, User Menu).
    - Footer (Links, Socials).
- [x] **Homepage**
    - Hero section (Video background/High-res image).
    - "Featured" cars carousel.
    - Search bar entry point.
- [x] **Search & Filtering (Smart Search)**
    - Implement filters (Make, Model, Price, Lifestyle tags).
    - Build "Specs at a Glance" cards.
    - Implement Server-Side search logic with Supabase.

## Phase 4: The "Digital Showroom" (Product Page)
- [x] **Media Gallery**
    - Implement 4K photo gallery with zoom.
    - Integrate YouTube Embed player for videos.
- [x] **Vehicle Details**
    - "Specs at a Glance" grid icon component.
    - "Digital Logbook" section (Service history mockups/downloads).
- [x] **Interactive Elements**
    - *Nice-to-have*: Interactive hotspots on images (custom component).

## Phase 5: Communication & Scheduling (Custom)
- [x] **Custom Booking System**
    - Database table for availability slots.
    - Frontend calendar component for selecting dates/times.
    - Real-time availability check.
- [x] **Live Chat System**
    - Floating widget.
    - Real-time messaging using Supabase Realtime.
    - Chat history persistence.
- [x] **WhatsApp Integration**
    - "Quick Chat" button implementation.

## Phase 6: Admin Panel (Command Center)
- [x] **Admin Layout**
    - Sidebar navigation (Inventory, Leads, Calendar).
    - Protected routes (Admin only).
- [x] **Inventory Management**
    - CRUD operations for Vehicles.
    - Bulk media uploader to Supabase Storage.
    - Status toggles (Available/Sold/Reserved).
- [x] **Lead Dashboard**
    - Kanban or List view of incoming inquiries.
    - Calendar view of booked test drives.

## Phase 7: Advanced Features & Trust
- [x] **Self-Service Tools**
    - Financing Calculator (Client-side logic).
    - Trade-in Valuation form (Zod validation + Supabase Edge Function stub).
- [x] **Comparison Tool**
    - State management (Zustand) to store selected cars.
    - Comparison view page.
- [x] **SEO Optimization**
    - Dynamic metadata generation for Vehicle Detail Pages.
    - Sitemap generation.

## Phase 8: Testing & Deployment
- [x] **Quality Assurance**
    - [x] Linting & Type checking.
    - [x] End-to-End testing flow (Listing -> Booking).
- [ ] **Deployment**
    - [x] Deploy to Vercel (Prepared).
    - [ ] Verify Supabase production connections.
