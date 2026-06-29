# Tripzy Technical Debt Report

This report documents oversized files, redundant code, architectural issues, and maintainability concerns within the Tripzy repository.

---

## 1. Oversized Files & Separation of Concerns

### File 1: `src/backend/api-handlers/plan-trip.ts` (37 KB, 860 lines)
- **Status**: **High Debt**
- **Analysis**:
  - The API handler performs route parsing, scoring calculations, Gemini integration, and holds over 600 lines of hardcoded offline fallback itineraries (for 12 destinations).
- **Remediation**:
  - Extract the offline fallback itineraries into a dedicated data file: `src/backend/data/offlineItineraries.ts`. This will reduce `plan-trip.ts` to under 250 lines, significantly improving readability and testability.

### File 2: `src/frontend/components/TripsWishlistView.tsx` (31 KB, 547 lines)
- **Status**: **Medium Debt**
- **Analysis**:
  - Contains multiple subcomponents (`ScrapbookPostcard`, `EmptyPassportState`) and rendering logic for timelines, badges, saved itineraries, and postcards in a single file.
- **Remediation**:
  - Split `ScrapbookPostcard` and `EmptyPassportState` into separate files inside a subfolder: `src/frontend/components/passport/`.

---

## 2. Redundant Code & Dead Logic

### 1. `Trip` vs `SavedItinerary` Tables
- **Analysis**:
  - The Prisma schema declares a `Trip` model and a `SavedItinerary` model, both representing user-saved itineraries.
  - The frontend only reads and writes to `SavedItinerary`.
  - `getUserTrips` in `userActions.ts` queries the `Trip` table but is never called anywhere in the codebase.
- **Remediation**: Remove the `Trip` model from `schema.prisma` and remove the dead `getUserTrips` server action from `userActions.ts`.

### 2. Duplicate Mobile Nav / Layout code
- **Analysis**:
  - In earlier passes, there was duplicate mobile navigation in `App.tsx`.
  - **Fixed**: `App.tsx` now has a single sticky brand header bar containing only the logo and back action, deferring navigation entirely to `BottomNavbar.tsx`.

---

## 3. Architecture Smells & Refactoring Pipeline

1. **Inline Database Mutations in Server Actions**:
   - Several Server Actions modify database tables directly (e.g. `userActions.ts` and `shareActions.ts`).
   - For better testability and isolation, database mutations should be placed in a data access layer (`src/backend/data-access/`), leaving server actions responsible only for session validation and request routing.
2. **Hardcoded India IDs**:
   - `App.tsx` contains a hardcoded array of `INDIA_IDS` used to sort Indian destinations first.
   - **Remediation**: Add a `country` field filter or a boolean `isPrimary` flag in the database to drive the sort order dynamically.
