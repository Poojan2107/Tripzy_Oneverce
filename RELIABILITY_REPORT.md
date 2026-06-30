# Reliability Report — Travebie V14

## AI / Gemini

### Plan-Trip Endpoint: Three-Layer Fallback

| Layer | Trigger | Response |
|-------|---------|----------|
| 1 | No API key configured | Returns offline itinerary immediately (200) |
| 2 | Gemini API fails / times out / invalid schema | Returns offline itinerary (200) after retries |
| 3 | Unexpected system error | Returns offline itinerary with fallback data (200); returns 500 only if even fallback fails |

### New: Timeout + Retry
- Server-side timeout: 20 seconds via `AbortSignal`
- Retry strategy: 2 retries with exponential backoff (1s, 2s)
- AbortError (timeout) is NOT retried (fail fast)
- Applied to both plan-trip and chat endpoints

### Chat Endpoint: Improved Reliability
- Previously returned 500 on Gemini failure
- Now returns friendly message with 200: "I'm having trouble connecting right now. Please try again in a moment."
- 20s timeout applied to stream initialization
- No retries on chat (streaming is not idempotent)

## Database

### Transaction Safety (NEW)
| Operation | Transaction | Risk Before |
|-----------|-------------|-------------|
| `toggleBookmark` | ✅ `$transaction` | TOCTOU race between findUnique and delete/create |
| `deleteSavedItinerary` | ✅ `$transaction` | TOCTOU race between ownership check and delete |

### N+1 Prevention (NEW)
| Query | Before | After |
|-------|--------|-------|
| `destinationPopularity` in `analyticsActions` | 5 individual `findUnique` calls | Single `findMany` with `in` clause |

## Failure Scenarios

### Tested Scenarios
| Scenario | Behavior |
|----------|----------|
| Database unavailable | `/api/health` returns 503; AI endpoints serve offline data |
| Gemini unavailable | Offline itinerary served via fallback layers |
| Redis unavailable | Rate limiting fails open (allows requests, logs warning) |
| Missing env vars | Prebuild check warns locally, fails Vercel build |
| Slow network | Client-side 30s abort; server-side 20s timeout |
| API timeout | AbortError caught, offline fallback used |
| Auth failure | 401 returned with clear message |
| Expired session | NextAuth handles automatically |

### Graceful Degradation
- All AI endpoints: offline data when live API fails
- Rate limiting: fails open when Redis is down
- ErrorBoundary: branded fallback UI with retry
- global-error.tsx: last-resort error page with Sentry reporting

## Monitoring

### Health Checks
- `/api/health`: DB connectivity + env variable presence
- `/api/ready`: Lightweight DB ping only
- Both documented and ready for Vercel/load balancer probes

### Error Reporting
- Sentry captures via `ErrorBoundary.componentDidCatch`
- Sentry captures via `global-error.tsx`
- Application still lacks `Sentry.captureException()` in catch blocks across most server actions
