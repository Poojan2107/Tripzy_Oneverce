# Launch Checklist — Tripzy

Canonical prod host: **https://travebie-oneverce.vercel.app**  
Local: **http://localhost:3030**

See `COFOUNDER_HANDOVER.md` for the full step-by-step before client delivery.

## Pre-Launch (Must Complete)

### Environment Variables (Vercel Dashboard)
- [ ] `DATABASE_URL` (Neon pooled)
- [ ] `AUTH_SECRET` / `NEXTAUTH_SECRET` (same value, no corrupted newlines)
- [ ] `NEXTAUTH_URL` = `https://travebie-oneverce.vercel.app`
- [ ] `NEXT_PUBLIC_BASE_URL` = `https://travebie-oneverce.vercel.app`
- [ ] `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- [ ] `GOOGLE_GENERATIVE_AI_API_KEY`
- [ ] `ADMIN_SETUP_KEY` (≥ 16 characters)
- [ ] `TESTING_MODE` = `false`
- [ ] `UPLOADTHING_TOKEN` (recommended for admin uploads)
- [ ] Sentry vars (optional): `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`
- [ ] Upstash (optional): `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

### Google OAuth Console
- [ ] Local origin: `http://localhost:3030`
- [ ] Local redirect: `http://localhost:3030/api/auth/callback/google`
- [ ] Prod origin: `https://travebie-oneverce.vercel.app`
- [ ] Prod redirect: `https://travebie-oneverce.vercel.app/api/auth/callback/google`

### Admin
- [ ] Promote first admin via `/admin/setup` or `node scripts/seed-admin-local.mjs <email>`

### Build / Smoke
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Home, AI planner, chat, OAuth, `/api/health`, `/api/ready`, admin

## Post-Launch (First Sprint)
- [ ] Neon Point-in-Time / backups
- [ ] Branch protection on GitHub
- [ ] Custom domain (if client provides) + update OAuth + `NEXTAUTH_URL` + `NEXT_PUBLIC_BASE_URL`
- [ ] Affiliate tracked links (optional monetization)

## Rollback
- Vercel: redeploy previous deployment
- Database: Neon PITR restore
