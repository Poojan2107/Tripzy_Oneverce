# Observability Report — Travebie V14

## Sentry Configuration

### Status: Configured but requires env vars

| File | Purpose | Status |
|------|---------|--------|
| `sentry.client.config.ts` | Client-side error tracking | ✅ DSN set from `NEXT_PUBLIC_SENTRY_DSN` |
| `sentry.server.config.ts` | Server-side error tracking | ✅ DSN set from `SENTRY_DSN` |
| `sentry.edge.config.ts` | Edge middleware/runtime tracking | ✅ DSN set from `SENTRY_DSN` |
| `next.config.js` | Sentry webpack plugin | ✅ `withSentryConfig` wrapper active |

### Required Environment Variables (not yet set)
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_DSN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`

### Trace Sampling (updated)
- Client: 0.1 (was 1.0)
- Server: 0.2 (was 1.0)
- Edge: 0.2 (was 1.0)

## Error Reporting

### ErrorBoundary (`src/frontend/components/ErrorBoundary.tsx`)
- Class-based React error boundary
- Now calls `Sentry.captureException()` with component stack trace
- Branded fallback UI with retry button
- Used in `App.tsx` to wrap main content

### Global Error Page (`src/app/global-error.tsx`)
- Newly created
- Captures root-level errors via `Sentry.captureException()`
- Branded fallback UI with "Try Again" button
- Only renders when root layout itself crashes

### Missing
- No `instrumentation.ts` for OpenTelemetry
- No `Sentry.setUser()` call to correlate errors with user sessions
- No custom Sentry release/version tagging

## Logging

### Current State
- 67+ `console.*` calls across the codebase
- No structured logger (no JSON, no levels, no correlation IDs)
- No log transport (stdout only)
- Dev mode enables Prisma SQL query logging

### Recommendations (P2)
- Create `src/backend/lib/logger.ts` with structured JSON output
- Add request ID via middleware header
- Replace `console.error/warn/log` calls with logger utility
- Add `NODE_ENV`-aware log level filtering

## Health & Readiness

### `/api/health` (new)
- Returns 200 with `{ status: "healthy", checks: { environment, database } }`
- Verifies DB connectivity via `SELECT 1`
- Returns 503 with failure details if checks fail
- `force-dynamic` to bypass cache

### `/api/ready` (new)
- Lightweight readiness probe
- Returns 200/503 with `{ ready: boolean, checks: { database } }`
- Suitable for Vercel deployment orchestration
