# Cofounder Handover - Tripzy (before client delivery)

**Read this first.** This package is code-complete for launch. Your job is to place secrets, wire external services, smoke-test, then hand the client the running app + `CLIENT_HANDOVER.md`.

| Item | Value |
|------|--------|
| Product | Tripzy / Travebie - AI travel companion for India |
| Package | `travebie` (Next.js 16) |
| Local URL | `http://localhost:3030` |
| Vercel project | `travebie-oneverce` |
| Prod URL | `https://travebie-oneverce.vercel.app` |
| Database | Neon PostgreSQL (Prisma) |
| Auth | NextAuth v5 + Google OAuth |
| AI | Google Gemini |

---

## What's already done (engineering)

- Full app: Explore chapters, AI planner, chat, passport, admin CRUD, maps
- Prisma schema + seed data (12 destinations / chapters)
- Auth, admin setup flow (`/admin/setup`), health endpoints (`/api/health`, `/api/ready`)
- CI workflow, typecheck, Vercel project linked
- Env template corrected (`.env.example`) - Postgres, port **3030**, UploadThing, Sentry, Upstash
- Canonical URL fallbacks aligned to live prod **https://travebie-oneverce.vercel.app**
- Local `.env` `NEXTAUTH_URL` fixed to port 3030 (not shipped in this zip)

**Not shipped in this zip (on purpose):** `node_modules`, `.next`, `.env*`, `.vercel`, secrets, build caches.

---

## What's left for YOU (ops) - do in order

### 1. Unzip & install

```bash
cd tripzy-handover   # or whatever you named the folder
npm install
cp .env.example .env
```

### 2. Fill `.env` (required)

| Variable | What to put |
|----------|-------------|
| `DATABASE_URL` | Neon **pooled** Postgres URL |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini key from Google AI Studio |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Same random secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Local: `http://localhost:3030` / Prod: `https://travebie-oneverce.vercel.app` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud OAuth credentials |
| `ADMIN_SETUP_KEY` | Long random string (16+ chars) |
| `NEXT_PUBLIC_BASE_URL` | Same as public site URL |

Optional but recommended:

| Variable | Why |
|----------|-----|
| `UPLOADTHING_TOKEN` | Admin image upload (paste-by-URL works without it) |
| `UPSTASH_REDIS_*` | API rate limits |
| `SENTRY_*` / `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring |

Keep `TESTING_MODE=false` everywhere in production.

### 3. Database

```bash
npx prisma db push
# Only if you need fresh seed (DESTRUCTIVE - wipes data):
# ALLOW_DB_WIPE=true npm run db:seed
```

If DB is already seeded on Neon, skip seed.

### 4. Google OAuth console

Add **both** environments:

**Local**
- Origin: `http://localhost:3030`
- Redirect: `http://localhost:3030/api/auth/callback/google`

**Production**
- Origin: `https://travebie-oneverce.vercel.app`
- Redirect: `https://travebie-oneverce.vercel.app/api/auth/callback/google`

If the client uses a custom domain later, add those origins/redirects too and update `NEXTAUTH_URL` + `NEXT_PUBLIC_BASE_URL`.

### 5. Promote first admin

1. `npm run dev` then open `http://localhost:3030`
2. Sign in once with Google (creates the user row)
3. Go to `/admin/setup` and enter `ADMIN_SETUP_KEY`
   **or** run: `node scripts/seed-admin-local.mjs cofounder@email.com`

### 6. Mirror the same env vars on Vercel

In Vercel -> Project `travebie-oneverce` -> Settings -> Environment Variables, set all **required** keys for Production (and Preview if needed). Redeploy after saving.

Especially set:

- `NEXTAUTH_URL=https://travebie-oneverce.vercel.app`
- `NEXT_PUBLIC_BASE_URL=https://travebie-oneverce.vercel.app`
- Gemini + Google OAuth + `ADMIN_SETUP_KEY` + `DATABASE_URL` + auth secrets
- UploadThing / Sentry if using them

### 7. Smoke test before client handover

- [ ] Home loads
- [ ] Google sign-in works (local + prod)
- [ ] AI planner returns an itinerary (needs Gemini key)
- [ ] Chat responds
- [ ] `/api/health` and `/api/ready` return OK
- [ ] Admin login + open `/admin`
- [ ] Bookmark / passport persists while signed in
- [ ] Admin image upload **or** paste URL works

### 8. Hand to client

Give them:

1. Live URL: `https://travebie-oneverce.vercel.app`
2. `CLIENT_HANDOVER.md` (product + ops overview)
3. Admin access (their Google email promoted)
4. This note on what **they** own going forward: Gemini billing, Neon, Google OAuth app, Vercel, optional UploadThing/Sentry

Do **not** send them this zip with your private `.env` / keys. They get their own secrets (or you rotate after transfer).

---

## Explicitly out of scope (not blockers)

These are product "coming soon" / future - not required for handover:

- In-app hotel booking (affiliate outbound links only today)
- Chat attachments & voice input
- Payment gateway / transactional email
- Affiliate tracked IDs in `src/frontend/data/hotels.ts` (plain OTA links today)

---

## Quick commands cheat sheet

```bash
npm install
npm run dev          # http://localhost:3030
npm run build
npm run typecheck
npx prisma db push
ALLOW_DB_WIPE=true npm run db:seed
node scripts/seed-admin-local.mjs you@email.com
```

---

## If something fails

| Symptom | Likely fix |
|---------|------------|
| Google login loops / callback error | `NEXTAUTH_URL` port/host mismatch or OAuth redirect URI wrong |
| AI offline / fallback only | Missing or invalid `GOOGLE_GENERATIVE_AI_API_KEY` |
| Admin upload fails | Add `UPLOADTHING_TOKEN` (or paste image URLs) |
| Empty explore / no chapters | Run `db push` + seed (with `ALLOW_DB_WIPE=true`) |
| Build fails on Vercel | Missing required env vars (see `scripts/check-env.mjs`) |

---

*Prepared for cofounder -> client handover. Code is ready; secrets and OAuth wiring are the remaining human steps.*
