# Tripzy — Final Client Handover Package (V10)

Welcome to the official handover package for **Tripzy**, a next-generation, storytelling-first AI Travel Companion for India. This document serves as the guide for the engineering, product, and operations teams to deploy, manage, and extend the platform.

* **Production URL**: [https://tripzy-oneverce.vercel.app](https://tripzy-oneverce.vercel.app)
* **Local Development**: `http://localhost:3000`

---

## 1. Project Overview

Tripzy is a highly premium, interactive travel web application built to help curious explorers discover India through **12 Handcrafted Chapters**. Departing from standard travel booking catalogs and generic search grids, Tripzy focuses on:
- **Storytelling and Heritage**: Highlighting cultural contexts, regional secrets, and local etiquette.
- **Passport Identity**: Replaced game-like "status level" mechanics with a dedicated **Explorer Passport** showcasing Chapters, Regions, and Journeys.
- **AI-Powered Personalization**: Dynamically constructing custom itineraries, day-by-day route maps, and estimated travel passes using the Google Gemini API.
- **Visual Excellence**: Implementing modern glassmorphism, responsive grid systems, and smooth animations using Tailwind CSS and Framer Motion.

---

## 2. Delivered Features

### 📖 The Explorer Passport
- **Explorer Badges & Seals**: Users collect digital stamps (e.g. *First Journey*, *Solo Explorer*, *Heritage Hunter*, *Mountain Nomad*) as they explore and save travel logs.
- **Travel Timeline Journal**: An elegant vertical timeline displaying past and planned trips organized by year.
- **Saved Chapters & Itineraries**: Persistent lists of bookmarked chapters and personalized journey plans.
- **Google Authentication**: Synchronizes passports across devices using NextAuth.

### 🗺️ Story Atlas (`/explore`)
- **Leaflet Map Integration**: A full-screen interactive map plotting the 12 chapters with responsive layouts for mobile, tablet, and desktop devices.
- **Category Filtering**: Fast navigation by mood/experience (Nature, Luxury, Food, Spiritual, Heritage, Beaches, Adventure, Photography).
- **Responsive Layout**: Designed to prevent duplicate footers and layout overflows on full-screen map views.

### 🔮 AI Planner & Journey Companion
- **Multi-Step Planner Wizard**: Gathers starting location, travel duration (1–14 days), budget parameters, travel companions, and preferred style.
- **Gemini API Engine**: Communicates with Google's LLM to generate granular day-by-day itineraries, weather predictions, and photography spots.
- **Journey Boarding Pass**: A gorgeous ticket-style layout showing estimated costs (Transit, Accommodations, Food) with a dynamic breakdown chart and custom barcodes.
- **Branded Recovery States**: Protects the user experience with branded error messages ("*We're consulting our explorer archive and preparing an alternative journey.*") and easy retry actions.

### 🏨 Curated Stays & Affiliate System
- **Affiliate Links**: Integration with major travel providers (Agoda, Goibibo, MakeMyTrip).
- **Safety Safeguards**: All external redirects open in a new tab (`target="_blank"`) with security headers (`rel="noopener noreferrer"`).
- **Click Tracking**: Logs telemetry when users explore stays to track partner affiliate performance.

---

## 3. Architecture

Tripzy is built on a modern, decoupled web architecture:

```mermaid
graph TD
    User[Web Client] -->|React / Next.js| FE[Frontend Components]
    FE -->|Client-Side Actions| Auth[NextAuth / Google OAuth]
    FE -->|Data Fetching / AI| API[Next.js API Routes]
    API -->|Prisma ORM| DB[(SQLite / PostgreSQL)]
    API -->|API Request| Gemini[Google Gemini API]
    API -->|Rate Limiting| Redis[(Upstash Redis)]
```

### Key Technical Stack
- **Framework**: Next.js 16.2 (App Router with Page Transitions).
- **Styling**: Tailwind CSS & Vanilla CSS variable configurations.
- **Database**: SQLite (local development) and PostgreSQL (production compatibility) connected via **Prisma ORM**.
- **Caching & Rate Limiting**: **Upstash Redis** REST client for securing AI endpoints against spam.
- **AI Engine**: `@ai-sdk/google` communicating with Google Gemini.

---

## 4. Deployment

### Local Development Setup
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file at the root using the template in `.env.example`.
3. Set up the local SQLite database and apply seed data:
   ```bash
   npx prisma db push
   npm run db:seed
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

### Deploying to Vercel
1. Create a new project in the Vercel Dashboard and link the repository.
2. Configure the **Environment Variables** (see Section 5).
3. Set up a PostgreSQL database (e.g., Vercel Postgres or Supabase).
4. Run the production build. The `postinstall` script in `package.json` will automatically generate the Prisma client, migrate the database schemas, and seed standard data:
   ```json
   "postinstall": "prisma generate && prisma db push --accept-data-loss && prisma db seed"
   ```

---

## 5. Environment Variables

Define the following environment keys in your production environment:

| Key | Description | Example / Source |
|---|---|---|
| `DATABASE_URL` | Prisma database connection string. | `file:./dev.db` (Local) / `postgres://...` (Production) |
| `GEMINI_API_KEY` | Google Generative AI API Token. | Get from Google AI Studio |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL for rate limits. | `https://your-db.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis authorization token. | Get from Upstash Console |
| `NEXTAUTH_URL` | Canonical URL of the application. | `https://tripzy-oneverce.vercel.app` |
| `AUTH_SECRET` | Secret key used for session encryption. | Generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID. | Google Cloud Platform Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret. | Google Cloud Platform Console |
| `ADMIN_SETUP_KEY` | Key to promote users to admin securely. | Choose a strong, secret token |

---

## 6. Admin Guide

Tripzy features a secure admin dashboard where operators can inspect platform telemetry, search queries, view event charts, and check rate limit quotas.

### Creating an Admin Account
To promote an explorer account to the `ADMIN` role:
1. Ensure the user has logged in once via Google Auth (this creates their `User` entry in the database). For demo testing, you can sign in using `aarav.mehta@example.com` (which is pre-seeded in the database).
2. Run the secure setup script locally or via CI:
   ```bash
   # For local databases
   node scripts/seed-admin-local.mjs aarav.mehta@example.com
   ```
3. Alternatively, invoke the secure backend endpoint (requires `ADMIN_SETUP_KEY` header):
   ```bash
   curl -X POST https://your-domain.com/api/admin/promote \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ADMIN_SETUP_KEY" \
     -d '{"email": "aarav.mehta@example.com"}'
   ```

---

## 7. AI Planner Notes

The itinerary engine utilizes structured prompts to guarantee high-quality Markdown responses from Gemini.
- **Location Constraints**: The planner restricts output to legitimate geographical regions and structures trips to avoid unrealistic transitions (e.g. crossing Varanasi and Munnar on the same afternoon).
- **Fallback Database Seeding**: In the event of Gemini service outages or network failures, the planner falls back to pre-seeded static itinerary structures.
- **Budget Tier Calculation**: Budget logic is derived dynamically (under ₹15,000 for Small, up to ₹40,000 for Medium, and above for Luxury) to map out realistic expenses for travel packages.

---

## 8. Affiliate System

Stays and hotels are fetched using regional keys. Users are redirected to:
- **Agoda**: Deals on luxury eco-resorts.
- **Goibibo**: Local budget retreats and homestays.
- **MakeMyTrip**: Heritage palaces and premium stays.

All partner buttons have telemetry attached via `trackAffiliateClick` inside [HotelCard.tsx](file:///d:/TRIPZY.Ai/tripzy/src/frontend/components/HotelCard.tsx). These clicks are sent to `/api/analytics` and can be audited in the Admin Dashboard.

---

## 9. Known Limitations

- **SQLite Database Concurrency**: SQLite is excellent for prototype and preview environments, but it can suffer from write locks under high concurrent traffic. Recommend migrating `DATABASE_URL` to a PostgreSQL database for production launch.
- **Rate Limit Reset Quotas**: The Upstash Redis config restricts users to 3 AI requests per hour. This is customizable inside `src/backend/lib/redis.ts`.

---

## 10. Future Enhancements

1. **Offline Map Mode**: Service worker caching of Leaflet map tiles for explorers traveling in low-connectivity areas (e.g. Ladakh passes).
2. **Direct Booking Handshake**: Integrate APIs from MakeMyTrip or Agoda to pull real-time room availability directly in the hotels tab.
3. **Itinerary Export**: Allow users to export their Boarding Passes and journals to PDF or Apple Wallet passes.

---

*Handover checklist completed. Tripzy is ready to ship to client.*
