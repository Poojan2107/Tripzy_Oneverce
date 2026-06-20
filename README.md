# Tripzy

AI-powered travel discovery and itinerary planning.

## Run locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Configure `.env`:
   - `GEMINI_API_KEY` — your Google Gemini API key (enables AI planner + chat)
   - `AUTH_SECRET` — random string (`openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — for Google sign-in
   - `DATABASE_URL` — defaults to SQLite (`file:./dev.db`)

4. Set up the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Browse destinations with mood-based discovery
- AI itinerary planner (Gemini)
- Saved wishlists & itineraries (synced to DB when signed in)
- Admin command center at `/admin`
- Shareable itineraries at `/share/[id]`
