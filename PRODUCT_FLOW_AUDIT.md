# Tripzy Product Flow Audit

This document reviews the end-to-end user journeys in Tripzy, validating correctness, highlighting user-experience issues, identifying runtime errors, and noting layout/mobile compatibility.

---

## 1. User Journey Verification

### Flow 1: Landing Page (`HomeView`)
- **Verification**: Evaluates HeroCarousel, CategoryScroller, AtlasPassportPreview, WhyTripzy, FeaturedChapters, TravelerStories, CompanionPreview, and Footer.
- **Findings**:
  - Carousel successfully transitions slides.
  - Category tags link to the filter state on the Atlas view.
  - Layout is fully responsive; font scaling adapts gracefully across mobile viewpoints.
  - *No dead buttons or broken links* identified.

### Flow 2: Story Discoveries (`ExploreView` / Atlas)
- **Verification**: Navigates to Atlas view, performs filter changes, searches for terms, interacts with Leaflet Map markers, and inspects preview cards.
- **Findings**:
  - Filter category chips correctly filter the cards list.
  - Search query triggers dynamic filter changes instantly.
  - Leaflet Map loads markers dynamically and centers on clicked destinations.
  - On mobile, the "List" vs "Map" toggle floating pill works correctly.
  - *Fixed Overlap*: The padding-bottom of the scroll list was adjusted to `pb-[calc(96px+env(safe-area-inset-bottom,8px))]` to ensure the final destination cards are not obscured by the floating bottom navbar.

### Flow 3: Chapter Details (`TourDetailsView`)
- **Verification**: Clicking a chapter opens details. Renders tagline, rating, reviews, and tabs.
- **Findings**:
  - Navigation tabs (Story, Explorer Log, Local Secrets, Plan & Prepare, Where To Stay) respond instantly without layout shifts.
  - Desktop layout utilizes a sticky sidebar with difficulty, season, must-try, and pricing details.
  - Mobile bottom sticky action bar provides an immediate call-to-action button for "Craft Journey".
  - *Alignment Correctness*: "Start AI Planning" button in the sidebar and bottom mobile drawer renamed to "Craft Journey" to match product nomenclature.

### Flow 4: Companion Journey Planner (`AiPlannerView` / `PlannerWizard`)
- **Verification**: Triggers the planner wizard, walks through inputs (destination, dates, budget tier, travel style, companions, guests, pace, daily rhythm).
- **Findings**:
  - Multi-step wizard manages local form state correctly.
  - Date inputs calculate trip duration automatically.
  - No crash risks identified when skipped or incomplete options are submitted.
  - Interactive cards react smoothly with scale animations.

### Flow 5: Itinerary Generation & Result (`PlannerResult`)
- **Verification**: Submits inputs, shows step-based loading states, calls `/api/plan-trip` server endpoint, parses result, and renders mapping coords, cost charts, and weather details.
- **Findings**:
  - Loading animation has high polish and provides textual reassurance during AI generation.
  - Renders dynamic Map markers for each day based on coordinate offsets, enabling visual journey tracking.
  - Handles fallback gracefully: If the Google Gemini API key is missing or encounters a timeout/error, it automatically switches to a beautiful local offline itinerary fallback matching the destination without crashing.

### Flow 6: Save Journey & Passport View (`TripsWishlistView` / Saved Chapters)
- **Verification**: Saves itinerary, views Passport page, toggles bookmark status, checks login prompts, and verifies timeline.
- **Findings**:
  - Saved itineraries are pushed to `localStorage` (for guests) and synced with database tables (for authenticated users).
  - Timeline displays historic milestones (2024–2026) correctly.
  - TripsWishlistView sub-tabs switch seamlessly between "Saved Chapters" and "Journey Collection".
  - Authenticated copy has been locked: `"Sign in to sync your Passport across devices."`

---

## 2. Identified Risks & UI Anomalies

| Area | Issue Description | Severity | Fix Status |
| :--- | :--- | :--- | :--- |
| **ExploreView** | Destination list last items obscured by the floating bottom navigation bar on mobile. | **Medium** | **Fixed** (Increased list padding bottom to `pb-[calc(96px+env(safe-area-inset-bottom,8px))]`) |
| **App.tsx** | Scroll-to-top button overlapped the mobile navigation bar. | **Low** | **Fixed** (Offset changed to `bottom-[calc(76px+env(safe-area-inset-bottom,12px))] md:bottom-6`) |
| **TourHero** | Displays a fake hardcoded `96% Match` badge. | **Medium** | **Fixed** (Replaced with dynamic mood-based tag matching the destination data) |
| **HeroCarousel** | Displays fake hardcoded `matchScore` percentages. | **Medium** | **Fixed** (Replaced with derived local mood tags) |
