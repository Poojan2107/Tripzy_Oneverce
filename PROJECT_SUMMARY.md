# Tripzy.Ai - Project Summary

Here is the architectural and functional summary of **Tripzy.Ai**'s current codebase.

---

## 🛠️ Technology Stack
*   **Framework:** Next.js (App Router, version `^16.2.7`) with **React 19** and **TypeScript**.
*   **Styling & Design:** Tailwind CSS (configured with modern `@tailwindcss/postcss` and `@tailwindcss/vite` plugins).
*   **Animations & Icons:** `motion` (Framer Motion) for micro-animations and `lucide-react` for premium iconography.
*   **Database ORM:** **Prisma** (`^6.19.3`) configured for a **PostgreSQL** database.
*   **Cache & Rate Limiting:** **Upstash Redis** and `@upstash/ratelimit` integration.
*   **AI Integration:** Vercel **AI SDK** (`ai` `^6.0.198`) paired with `@ai-sdk/google` (targeting `gemini-1.5-pro-latest`).
*   **Authentication:** NextAuth.js (`^5.0.0-beta.31`).

---

## 📂 Directory & Component Structure
The project is split cleanly into a standard Next.js App Router structure under `src/`:

### 1. Database Schema & ORM (`prisma/schema.prisma`)
Contains full relational definitions for:
*   `User`, `Account`, `Session` (Auth & Profiles)
*   `Destination`, `Category` (Travel packages / tours metadata)
*   `Trip` (Generated itineraries)
*   `Bookmark` (Wishlist) & `Review` (User reviews)
*   `Conversation`, `Message` (AI Chat Assistant history)

### 2. Backend Services & Routes (`src/backend/`)
*   **API Handlers:** 
    *   `api-handlers/chat.ts`: Handles streaming AI conversation responses with Gemini.
    *   `api-handlers/plan-trip.ts`: Generates structured JSON itineraries using `generateObject` with Zod validation. Includes fallback mock responses for local offline preview when the Gemini API Key is not configured.
*   **Server Actions:** DB-bound actions in `tourActions.ts` and `userActions.ts`.
*   **Lib:** Base clients for Prisma (`db.ts`) and Redis (`redis.ts`).

### 3. Frontend Application (`src/frontend/`)
*   **Core State Hub (`App.tsx`):** Controls current tabs (`home`, `explore`, `ai-planner`, `profile`, `admin`), manages active selected tours, and synchronizes wishlist/bookings state with `localStorage` for offline persistence. Also registers global keyboard shortcuts (e.g., `Cmd+K` / `Ctrl+K` for global search).
*   **Key UI Components (`src/frontend/components/`):**
    *   `Hero.tsx`: Immersive background with a search bar and quick filters.
    *   `NetflixCategoryRows.tsx`: Premium horizontal-scrolling categories of luxury expeditions.
    *   `ExploreView.tsx`: Full catalog with multi-category filtering.
    *   `TourDetailsView.tsx`: Rich page layout for individual tours, featuring details, pricing, schedule info, bookmarks, and booking flows.
    *   `AiPlannerView.tsx`: Travel planning assistant interface.
    *   `ProfileView.tsx`: User portal for digital tickets, booking codes, and bookmark wishlists.
    *   `AdminView.tsx`: Command center managing active tours (Create/Update/Delete) and updating client bookings status (Pending, Approved, Checked-In, Cancelled).

---

## 🚀 Key Features Built-in
1.  **AI Travel Planner:** Forms capturing dates, budgets, travelers, and styles that query Gemini to return structured weather, pricing, nearby destinations, and day-by-day activities.
2.  **Concierge Dashboard:** A client dashboard to manage bookings, render digital boarding passes, and keep wishlists.
3.  **Command Center:** Full CRUD administration capabilities to customize available tour packages.
4.  **Responsive Layout:** Fully optimized for desktop (using a premium floating glass navbar) and mobile devices (using bottom floating pill navbar).
