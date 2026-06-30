# Launch Checklist — Travebie V14

## Pre-Launch (Must Complete)

### Environment Variables (Vercel Dashboard)
- [ ] Set `NEXT_PUBLIC_SENTRY_DSN`
- [ ] Set `SENTRY_DSN`
- [ ] Set `SENTRY_ORG`
- [ ] Set `SENTRY_PROJECT`
- [ ] Set `SENTRY_AUTH_TOKEN`
- [ ] Verify `DATABASE_URL` is correct (NeonDB pooled)
- [ ] Verify `AUTH_SECRET` is clean (no `\r\n` corruption)
- [ ] Verify `GOOGLE_GENERATIVE_AI_API_KEY` is valid
- [ ] Verify `ADMIN_SETUP_KEY` is ≥ 16 characters
- [ ] Verify `NEXTAUTH_URL` points to `https://travebie-oneverce.vercel.app`
- [ ] Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### Google OAuth Console
- [ ] Authorized JavaScript origins: `https://travebie-oneverce.vercel.app`
- [ ] Authorized redirect URIs: `https://travebie-oneverce.vercel.app/api/auth/callback/google`

### Build Verification
- [ ] `npm run build` — 0 errors, 0 warnings
- [ ] `npm run typecheck` — 0 errors
- [ ] Middleware active (routes protected by security headers)

### Smoke Tests
- [ ] Home page loads (200)
- [ ] AI planner generates itinerary (online + offline)
- [ ] Chat assistant responds
- [ ] Admin setup flow works
- [ ] Google OAuth sign-in works
- [ ] Bookmarks persist (local storage + sync)
- [ ] Health endpoint returns 200 (`/api/health`)
- [ ] Readiness endpoint returns 200 (`/api/ready`)

## Post-Launch (First Sprint)

### Security
- [ ] Add `connection_limit` parameter to DATABASE_URL
- [ ] Add ESLint with security plugin
- [ ] Reduce Sentry tracesSampleRate to 0.05/0.01

### Performance
- [ ] Migrate TourHero.tsx banner to `next/image`
- [ ] Migrate remaining 19 `<img>` tags
- [ ] Install `@next/bundle-analyzer` and audit bundles

### Database
- [ ] Add indexes on `Account.userId` and `Session.userId`
- [ ] Consider removing unused `password` field from User model

### Observability
- [ ] Create structured logger utility
- [ ] Add request correlation IDs via middleware
- [ ] Add `Sentry.setUser()` in authorized sessions

### Process
- [ ] Enable branch protection on GitHub
- [ ] Configure Vercel preview deployments
- [ ] Set up database backup schedule (NeonDB Point-in-Time)
- [ ] Document incident response runbook

## Rollback Plan
- Vercel: Deploy previous commit via dashboard
- Database: NeonDB Point-in-Time restore
- Domain: DNS change to previous deployment
