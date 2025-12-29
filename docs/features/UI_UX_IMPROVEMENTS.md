# UI/UX Improvement Checklist

This document outlines a comprehensive plan to review and improve the responsiveness, margins, and overall UX/UI of the Car Seller application.

## 1. Global Design System & Layout
- [x] **Typography Hierarchy**
    - Audit heading sizes (h1-h4) for clear visual hierarchy.
    - Ensure readable line heights (leading-relaxed) for body text.
    - Verify font sizes on mobile devices (prevent text being too small or headers too large).
- [x] **Color & Contrast**
    - Check text contrast ratios against backgrounds (especially muted text `text-muted-foreground`).
    - Verify `oklch` color variable consistency in dark mode.
- [x] **Spacing & Margins**
    - Standardize container padding:
        - Mobile: `px-4`
        - Tablet: `px-6`
        - Desktop: `px-8` (or `max-w-7xl` centered).
    - Ensure consistent vertical spacing between sections (`py-12` or `py-16`).
- [x] **Button & Interactive Elements**
    - Verify touch targets are at least 44x44px on mobile.
    - Ensure consistent hover, focus, and active states for all buttons.

## 2. Navigation & Footer
### Navbar (`src/components/layout/navbar.tsx`)
- [x] **Mobile Menu**:
    - Ensure the "Sheet" menu content has correct padding and font sizes.
    - Check "Sign In" / User Menu visibility on small screens (< 375px).
- [x] **Search Bar**:
    - Prevent layout shift or overflow on mobile when search is expanded or present.
    - Consider collapsing search into an icon on mobile header if space is tight.
- [x] **Sticky Behavior**:
    - Verify background blur and transparency effects (`backdrop-blur`) work across browsers.

### Footer (`src/components/layout/footer.tsx`)
- [x] **Responsive Stacking**:
    - Ensure links stack vertically on mobile (1 column) and expand on desktop (4 columns).
    - Add sufficient spacing between link groups on mobile.
- [x] **Copyright & Socials**:
    - Center align copyright text on mobile.

## 3. Page-Specific Improvements

### Home Page (`src/app/page.tsx`)
- [x] **Hero Section** (`src/components/home/hero.tsx`):
    - **Height**: Set `min-h-[600px]` or `min-h-[80vh]` to prevent content cramping on mobile browsers with address bars.
    - **Text Contrast**: Ensure text is readable over the background image (adjust overlay opacity if needed).
    - **CTA Buttons**: Stack buttons vertically on mobile (w-full) for better reachability.
- [x] **Featured Cars** (`src/components/home/featured-cars.tsx`):
    - **Carousel**: Verify swipe gestures on mobile.
    - **Cards**: Ensure `aspect-ratio` holds up on different screen widths.
    - **"View All" Button**: Align properly on mobile (maybe below the heading or at the bottom of the section).

### Inventory & Car Cards (`src/components/inventory/car-card.tsx`)
- [x] **Card Layout**:
    - Mobile: 1 column.
    - Tablet: 2 columns.
    - Desktop: 3 columns.
- [x] **Comparison Feature**:
    - **Critical UX**: The "Compare" button is currently `opacity-0 group-hover:opacity-100`. This **does not work on mobile**. Change to always visible on touch devices or move to a persistent location (e.g., top right icon).
- [x] **Image Optimization**:
    - Replace `img` tags with `next/image` for better performance and layout shift prevention.
- [x] **Badges**: Ensure status badges don't obscure important parts of the car image.

### Car Details Page (`src/app/car/[id]/page.tsx`)
- [x] **Header**:
    - Ensure Title and Price stack correctly on mobile.
- [x] **Gallery** (`src/components/car-details/media-gallery.tsx`):
    - Ensure the main image is swipeable or has clear navigation arrows on mobile.
    - Thumbnails should be scrollable if too many.
- [x] **Sticky Sidebar**:
    - On Tablet (portrait), ensure the sticky sidebar doesn't overlap or squash the main content. Move to bottom if necessary for tablet portrait.
- [x] **Call to Actions**:
    - "Chat with Sales" and "Booking" buttons should be sticky at the bottom of the screen on mobile for easy access (optional but recommended for conversion).

### Forms & Modals
- [x] **Inputs**: Font size should be 16px on mobile to prevent iOS zoom-in on focus.
- [x] **Modals** (`Dialog` / `Sheet`):
    - Ensure close buttons are easily tappable.
    - Content should be scrollable if it exceeds viewport height (especially on landscape mobile).

## 4. Technical & Performance
- [x] **CLS (Cumulative Layout Shift)**: Add width/height attributes or aspect-ratio classes to all images.
    - Implemented `next/image` in `CarCard` and `MediaGallery`.
- [x] **Loading States**: Add Skeleton loaders for data-fetching components (Car Details, Inventory).
    - Added `loading.tsx` for `/buy` and `/car/[id]`.

## 5. Action Plan
1.  **Audit**: Run the app locally (`npm run dev`) and inspect with Chrome DevTools Device Mode (iPhone SE, iPad Air, Desktop).
2.  **Fix Global Styles**: Update `globals.css` or `layout.tsx` for container defaults.
3.  **Component Refactor**: Iterate through Navbar, Hero, and Cards first.
4.  **Mobile UX Polish**: Fix the "Hover-only" compare button issue.
5.  **Verification**: Test critical flows (Search -> View Car -> Compare -> Contact).
    - **Status**: E2E tests passed for all core flows.
