# Performance Report — Travebie V14

## Bundle Size

### Dependencies (925 MB node_modules)
| Package | Size | Notes |
|---------|------|-------|
| Prisma | 306 MB | Engine binaries for multiple platforms |
| Next.js | 278 MB | Framework + Turbopack |
| @sentry | 40 MB | Error monitoring |
| lucide-react | 34 MB | SVG icon library |
| framer-motion | 4.6 MB | Animation |

### Bundle Analysis
- Not yet set up (no `@next/bundle-analyzer`)
- All map components correctly use `next/dynamic` with `ssr: false`
- No webpack chunk naming configured

## Code Splitting

### Dynamic Imports (6 instances)
| Component | File | Loading Fallback |
|-----------|------|------------------|
| `AiPlannerView` | `App.tsx` | Spinner |
| `TripsWishlistView` | `App.tsx` | Spinner |
| `DiscoveryMap` | `ExploreView.tsx` | Skeleton |
| `ItineraryMap` | `PlannerResult.tsx` | Skeleton |
| `PassportMap` | `TripsWishlistView.tsx` | Skeleton |
| `ItineraryMap` | `SharedMap.tsx` | Skeleton |

## Image Optimization

### Using next/image (✅)
- `SafeImage.tsx` wrapper (fill, sizes, lazy loading)
- HeroCarousel background and card images

### Using raw `<img>` tags (⚠ 20 instances)
- TourHero.tsx main banner (highest impact — full-viewport image)
- Navigation avatars, admin thumbnails, search results, category cards
- These miss WebP/AVIF conversion, responsive srcsets, and lazy loading

## Font Loading

### Strategy: ✅ Optimal
- `next/font` with `display: swap`
- Nunito Sans (300/400/600/800) and Pacifico (400) as CSS variables
- No third-party font loaders

## Rendering

### Memoization
- 0 `React.memo` components — all re-render unconditionally
- 22 `useMemo` instances (mostly derived data)
- 5 `useCallback` instances
- Acceptable for current page complexity; revisit if rendering becomes a bottleneck

## Lighthouse Targets
- Desktop: ≥ 95 (achievable with image migration)
- Mobile: ≥ 90 (achievable with image migration)

## Recommendations (Priority Order)
1. Migrate TourHero.tsx main banner to `next/image` (LCP impact)
2. Install `@next/bundle-analyzer` and audit bundle composition
3. Migrate remaining 19 raw `<img>` tags to `SafeImage` wrapper
4. Add `React.memo` to `HeroCarousel` card and `ExploreView` list items if profiling shows churn
