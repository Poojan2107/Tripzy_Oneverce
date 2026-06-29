# Tripzy Performance Audit Report

This report evaluates Tripzy's frontend bundle, hydration timeline, image handling, and rendering performance, focusing on high-impact wins.

---

## 1. Bundle Size & Component Loading

The largest dependencies in Tripzy are:
- **Leaflet**: Map rendering library (used in Atlas view and Journey results).
- **Framer Motion**: Controls page and card animations.
- **Lucide React**: Heavy SVG icon package.

### Core Optimization Strategy (Current Status)
- **Dynamic Imports**:
  - The heavy Leaflet map component (`DiscoveryMap.tsx` and `ItineraryMap.tsx`) and views like `AiPlannerView` and `TripsWishlistView` are loaded dynamically using Next.js `dynamic()` with `ssr: false`.
  - This successfully prevents Leaflet from trying to reference client-only window APIs during server-side pre-rendering, ensuring no hydration mismatches occur.
- **Lucide Icons**:
  - All icons are imported individually. The tree-shaking capabilities of Next.js Turbopack optimize the compiled Lucide React bundles.

---

## 2. Image Optimization & Hydration

- **Hydration**: Next.js 16 compiles and executes quickly. No major hydration blocking code identified in initial layout rendering.
- **Image Performance**:
  - The application uses `SafeImage.tsx` to handle fallback images.
  - However, standard `<img>` tags are used for hero banners and postcards instead of Next.js `<Image>` from `next/image`.
  - **Issue**: Standard `<img>` tags do not automatically serve compressed formats (e.g. WebP, AVIF) or handle responsive sizing (srcsets), which results in large image payload downloads on mobile devices.

---

## 3. Recommended Performance Wins

### Quick Wins (High Impact, Low Effort)
1. **Convert to Next.js Image Component**:
   - Replace standard `<img>` tags with `<Image>` from `next/image` in `TourHero.tsx`, `HeroCarousel.tsx`, and `ScrapbookPostcard`.
   - **Benefit**: Auto-compresses images, scales size dynamically based on display, and implements native lazy-loading, saving up to 60-80% of bandwidth on image-heavy pages.

### Medium Wins (Moderate Effort)
1. **Framer Motion Layout Animations**:
   - Limit the use of `layout` and `layoutId` props on complex lists in `ExploreView.tsx` and `TripsWishlistView.tsx`.
   - **Benefit**: Reduces the browser recalculation overhead during tab switching, preventing frame drops on low-end mobile devices.

### Major Refactors (High Effort)
1. **Mapbox / Vector Maps Migration**:
   - Migrate from Leaflet (which renders heavy tile images) to a lightweight vector map solution or a lighter static map generator for simple static route previews.
   - **Benefit**: Reduces bundle size by ~40KB and decreases memory overhead.
