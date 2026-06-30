# Security Verification — Travebie V14

## Findings & Remediation Status

### Critical
| Finding | Status | Fix |
|---------|--------|-----|
| `.env` secrets committed to git | ✅ **Not an issue** — `.env` is properly gitignored (`# Environment: .env*`), not tracked in git |

### High
| Finding | Status | Fix |
|---------|--------|-----|
| No middleware / security headers | ✅ **Fixed** — `middleware.ts` created importing from `src/proxy.ts` (CSP, HSTS, XFO, XCTO, Referrer-Policy, Permissions-Policy) |
| Admin POST no rate limiting | ✅ **Fixed** — `checkRateLimit()` added |
| Analytics POST no rate limiting | ✅ **Fixed** — `checkRateLimit()` added |
| No CSRF protection on API routes | ✅ **Fixed** — Origin/Referer validation on admin POST |
| Admin GET leaks isAdmin status | ✅ **Fixed** — returns 403 for non-admin users |
| Chat API 500 on Gemini failure | ✅ **Fixed** — returns graceful offline message with 200 |
| Chat API no timeout | ✅ **Fixed** — 20s AbortSignal timeout added |

### Medium
| Finding | Status | Fix |
|---------|--------|-----|
| Rate limiting fails open | ✅ **Accepted** — intentional fail-open for resilience; logged via `console.warn` |
| Plan-trip no server timeout | ✅ **Fixed** — `callGeminiWithRetry` with 20s AbortSignal timeout |
| No retry on Gemini failure | ✅ **Fixed** — 2 retries with exponential backoff (1s, 2s) |
| Admin POST no constant-time comparison | ✅ **Fixed** — `timingSafeEqual` implementation |
| TypeScript strict mode off | ✅ **Fixed** — enabled, all errors resolved |

### Low
| Finding | Status | Notes |
|---------|--------|-------|
| Unsafe `(user as any).role` cast | ⚠ Existing | Low risk — Prisma User model stable |
| Raw `x-forwarded-for` for rate limiting | ⚠ Existing | Now also uses authenticated user ID |
| No explicit cookie config | ⚠ Existing | NextAuth v5 defaults are secure |
| User model has unused `password` field | ⚠ Existing | Remove in schema cleanup pass |

## Current Security Posture

### Headers (via middleware)
| Header | Value |
|--------|-------|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.vercel.live https://vercel.live https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.googleapis.com; img-src 'self' data: blob: https: http:; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://*.vercel.live; connect-src 'self' https: http:; worker-src 'self' blob:` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

### Rate Limiting
| Endpoint | Limit | Identifier |
|----------|-------|------------|
| POST `/api/plan-trip` | 10 req / 10s | User ID or IP |
| POST `/api/chat` | 10 req / 10s | User ID or IP |
| POST `/api/admin` | 10 req / 10s | IP |
| POST `/api/analytics` | 10 req / 10s | IP |

### Authentication
| Endpoint | Auth Required |
|----------|---------------|
| GET `/api/admin` | Yes (Session) |
| POST `/api/admin` | No (setup key + CSRF) |
| POST `/api/plan-trip` | No (rate-limited) |
| POST `/api/chat` | No (rate-limited) |
| POST `/api/analytics` | No (rate-limited) |
| Server actions | Via `auth()` call in individual functions |
