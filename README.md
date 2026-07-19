# Tripzy India

**AI-Powered Travel Intelligence for the Indian Subcontinent**

Tripzy is a premium travel planning platform built exclusively for India. It combines real-time AI itinerary generation with a curated editorial destination library, giving travelers a concierge-grade planning experience across 12 iconic Indian journeys.

> **Handover:** Cofounders start with [`COFOUNDER_HANDOVER.md`](./COFOUNDER_HANDOVER.md). Env template: [`.env.example`](./.env.example). Dev server: `http://localhost:3030`.

---

## Quick start

```bash
npm install
cp .env.example .env   # fill required keys
npx prisma db push
npm run dev            # http://localhost:3030
```

---

## Product Overview

Tripzy is not a booking aggregator. It is an intelligent travel companion that understands context — budget, travel style, group size, duration — and responds with structured, day-by-day itineraries tailored to each traveler.

The platform covers the full journey lifecycle: discovery, planning, booking, and post-trip management — all within a single, unified interface.

---

## Core Capabilities

### AI Journey Planner
Powered by Google Gemini, the planner accepts natural language inputs and structured parameters (budget, dates, group composition, travel mood) and returns validated JSON itineraries complete with day-by-day activities, accommodation recommendations, weather context, local tips, and cost breakdowns. The system degrades gracefully when the AI layer is unavailable, serving rich pre-built offline itineraries.

### Explore Atlas
A full catalog of 12 curated Indian Chapters — from Varanasi's sacred Ghats to the Andaman coral reefs. Each destination is rendered with editorial photography, cultural narrative, signature experiences, and local insider knowledge. Supported by multi-axis filtering across travel style, region, budget, and category.

### Journey Builder
A structured booking flow for converting discovered destinations into confirmed journeys. Manages group size, travel dates, special requests, and generates digital boarding passes and booking references accessible from the traveler passport.

### Traveler Passport
A personal dashboard giving travelers a live view of their bookings, saved destinations, digital tickets, and booking status — rendered as premium pass-style UI cards.

### Command Center (Admin)
A full CRUD administration interface for managing the destination inventory, experience catalog, and booking pipeline. Supports destination creation, editing, status management, and direct booking lifecycle control (Pending → Approved → Checked-In → Cancelled).

### Interactive Map
Leaflet-powered geographical explorer rendering all 12 Indian Chapters as interactive points on a styled map with contextual popups and destination detail previews.

---

## Technology

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.8 |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |
| AI | Google Gemini via Vercel AI SDK |
| ORM | Prisma 6 |
| Database | PostgreSQL (Neon) via Prisma |
| Auth | NextAuth.js v5 |
| Rate Limiting | Upstash Redis |
| Maps | Leaflet |
| Validation | Zod |

---

## Architecture

```
src/
├── app/                    # Next.js App Router — pages and API routes
│   ├── api/
│   │   ├── plan-trip/      # AI itinerary generation endpoint
│   │   ├── chat/           # Streaming AI conversation endpoint
│   │   ├── analytics/      # Usage tracking
│   │   └── auth/           # NextAuth.js authentication
│   ├── admin/              # Admin command center
│   ├── trips/              # Trip management
│   ├── share/[id]/         # Shareable journey links
│   ├── contact/            # Contact page
│   ├── privacy/            # Privacy policy
│   └── terms/              # Terms of service
│
├── backend/
│   ├── api-handlers/       # Core business logic (plan-trip, chat)
│   ├── actions/            # Server actions (tours, users)
│   └── lib/                # Prisma client, Redis client, Auth config
│
└── frontend/
    ├── App.tsx             # Root state orchestrator
    ├── components/         # All UI views and shared components
    │   ├── HomeView.tsx
    │   ├── ExploreView.tsx
    │   ├── AiPlannerView.tsx
    │   ├── TourDetailsView.tsx
    │   ├── ProfileView.tsx
    │   ├── AdminView.tsx
    │   ├── DiscoveryMap.tsx
    │   ├── ItineraryMap.tsx
    │   └── ui/             # Primitive components (SafeImage, etc.)
    ├── hooks/              # Custom React hooks
    ├── styles/             # Global CSS and design tokens
    ├── types.ts            # Shared TypeScript interfaces
    └── utils/              # Utility functions

prisma/
├── schema.prisma           # Full relational schema
└── seed.ts                 # 12 Indian Chapters seed data

public/
└── images/                 # Local editorial image library (53 assets)
    └── tours/              # Destination banner and gallery images
```

---

## Data Model

The Prisma schema defines the following core entities:

- **Destination** — The 12 Indian Chapters with metadata, pricing, images, and geographic coordinates
- **Category / Experience** — Travel style taxonomy (Adventure, Luxury, Spiritual, Food, Nature, Heritage, Beaches)
- **Trip** — AI-generated itineraries persisted per user
- **Bookmark** — Traveler wishlist
- **Review** — Destination rating and feedback
- **Conversation / Message** — AI chat session history
- **User / Account / Session** — NextAuth authentication records

---

## Environment Configuration

Copy `.env.example` → `.env`. Required keys include `DATABASE_URL` (Neon Postgres), `GOOGLE_GENERATIVE_AI_API_KEY`, `AUTH_SECRET`, `NEXTAUTH_URL` (`http://localhost:3030` locally), Google OAuth, and `ADMIN_SETUP_KEY`. Full checklist: `COFOUNDER_HANDOVER.md`.

---

## Design System

Tripzy follows a premium editorial visual language:

- **Typography**: Inter — clean, legible, modern
- **Color palette**: Deep navy, warm sand, ocean teal, and saffron accent — inspired by the natural palette of the Indian subcontinent
- **Motion**: Subtle entrance animations and hover micro-interactions via Framer Motion
- **Image library**: 53 local editorial photography assets — banners, gallery images, category cards, story portraits
- **Responsive**: Floating glass navbar on desktop; bottom pill navigation on mobile

---

## Resilience

- **AI offline fallback**: When Gemini is unavailable, `getBaseOfflineItinerary()` returns structured pre-built itineraries — the product remains fully functional
- **Image fallback**: `SafeImage` renders a graceful placeholder for any missing image source
- **Rate limiting**: Upstash Redis throttles API abuse; fails open if Redis is not configured
- **TypeScript**: Strict typing across the full stack with Zod validation on all AI-generated output

---

## Image Library

All destination imagery is served from local assets — no external CDN dependencies.

| Collection | Count |
|---|---|
| Destination banners | 12 |
| Destination galleries | 24 |
| Category cards | 6 |
| Story images | 3 |
| Hero images | 5 |
| Avatars | 3 |
| **Total** | **53** |

---

*Tripzy India — Built for the modern Indian traveler.*
