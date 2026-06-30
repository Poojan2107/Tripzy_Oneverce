# Travebie — Zero-to-Hero Production Readiness Playbook

This guide contains the exact steps, code diffs, and configurations required to resolve all P0, P1, and P2 architecture, database, security, and performance findings in the Travebie codebase.

---

## 1. P0 (Launch Blocker) — Database Provider Conflict

### Problem
The Prisma database client helper `db.ts` overrides production connections to copy a static SQLite binary `dev.db` to `/tmp` and open it, despite the `schema.prisma` file declaring `provider = "postgresql"`. This causes immediate runtime crashes on Vercel.

### Zero-to-Hero Fix
Replace the contents of [`src/backend/lib/db.ts`](file:///d:/TRIPZY.Ai/tripzy/src/backend/lib/db.ts) with a clean serverless connection manager.

```typescript
// src/backend/lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const getPrismaClient = () => {
  // Check for DATABASE_URL; default to a clean instance
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Prisma client may fail to connect.");
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const db = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

---

## 2. P1 (High Priority) — Connection Pooling & Security Guards

### 2.1 Serverless Connection Pooling (Neon Postgres)
Without pooling, concurrent serverless Lambdas open direct transaction channels to the database and exhaust Postgres's default connection limit (usually 100).
- **Fix**: Update the environment variables in your Vercel Dashboard to route `DATABASE_URL` to the pooled Neon connection string.
- Pooled strings end with `-pooler` (e.g. `postgresql://user:pass@ep-cool-wood-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true`).

---

### 2.2 Middleware Admin API Endpoint Protection
Secure all endpoints matching `/api/admin/*` at the middleware layer.
- **Fix**: Create or edit [`src/middleware.ts`](file:///d:/TRIPZY.Ai/tripzy/src/middleware.ts):

```typescript
// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/api/admin") || req.nextUrl.pathname.startsWith("/admin");

    if (isAdminRoute && token?.role !== "ADMIN") {
      return new NextResponse(
        JSON.stringify({ error: "Access Denied: Admin role required." }),
        { status: 403, headers: { "content-type": "application/json" } }
      );
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

---

### 2.3 AI Endpoint Fetch Timeout Boundary
If the Gemini API responds slowly, Vercel Serverless Functions hang and time out, wasting resources.
- **Fix**: Wrap the generative call inside a `Promise.race` in [`src/backend/api-handlers/plan-trip.ts`](file:///d:/TRIPZY.Ai/tripzy/src/backend/api-handlers/plan-trip.ts).

```typescript
// Replace the API call in plan-trip.ts:
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Gemini API call timed out")), 14000)
);

const modelCallPromise = genAI.models.generateContent({
  model: "gemini-2.0-flash",
  contents: prompt,
  config: { /* ... */ }
});

const response = await Promise.race([modelCallPromise, timeoutPromise]);
```

---

## 3. P2 (Medium Priority) — Code Cleanups & Performance

### 3.1 Code-Split Static Fallback Itineraries
Remove the 500 lines of hardcoded itinerary fallback data from [`plan-trip.ts`](file:///d:/TRIPZY.Ai/tripzy/src/backend/api-handlers/plan-trip.ts) and place them in a clean constants file.
- **Fix**: Create [`src/backend/data/fallbackItineraries.ts`](file:///d:/TRIPZY.Ai/tripzy/src/backend/data/fallbackItineraries.ts), move `getBaseOfflineItinerary()` into it, and import it inside the API handler.

---

### 3.2 Zod Payload Validation inside Server Actions
Ensure all writes to PostgreSQL verify types, bounds, and ranges.
- **Fix**: Create [`src/backend/validation/destination.ts`](file:///d:/TRIPZY.Ai/tripzy/src/backend/validation/destination.ts):

```typescript
import { z } from "zod";

export const destinationSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().optional(),
  country: z.string().min(2),
  city: z.string().min(2),
  region: z.string().nullable().optional(),
  description: z.string().min(10),
  price: z.number().nonnegative(),
  duration: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});
```
- Parse requests inside `createDestination()`:
```typescript
const parsed = destinationSchema.safeParse(data);
if (!parsed.success) {
  return { success: false, error: parsed.error.message };
}
```

---

### 3.3 Next.js Image Optimization
Transform raw HTML `<img>` items to Next.js Optimized Images to improve Largest Contentful Paint (LCP) speeds.
- **Fix**: Replace image render wrappers in [`src/frontend/components/ui/SafeImage.tsx`](file:///d:/TRIPZY.Ai/tripzy/src/frontend/components/ui/SafeImage.tsx) to use `next/image`.

```typescript
import Image from "next/image";

// Inside rendering:
<Image
  src={src}
  alt={alt}
  width={width || 500}
  height={height || 350}
  className={className}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..."
/>
```

---

## 4. Database Index Optimization

Add explicit indexes on foreign keys to prevent sequential table scans as user reviews and bookmarks increase.
- **Fix**: Edit [`prisma/schema.prisma`](file:///d:/TRIPZY.Ai/tripzy/prisma/schema.prisma) to add index declarations:

```prisma
model Review {
  id            String      @id @default(cuid())
  userId        String
  destinationId String
  rating        Int
  comment       String?
  createdAt     DateTime    @default(now())

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  destination Destination @relation(fields: [destinationId], references: [id], onDelete: Cascade)

  @@index([destinationId])
  @@index([userId])
}

model Bookmark {
  id            String      @id @default(cuid())
  userId        String
  destinationId String
  createdAt     DateTime    @default(now())

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  destination Destination @relation(fields: [destinationId], references: [id], onDelete: Cascade)

  @@unique([userId, destinationId])
  @@index([destinationId])
}
```
Run migrations:
```bash
npx prisma migrate dev --name add_foreign_key_indexes
```

---

## 5. Scaling Checklist (Hero Level)

To scale Travebie to 1M+ active monthly users:
1.  **Prompt Caching**: Enable caching headers inside Gemini client settings to reduce LLM tokens bills.
2.  **Read-Replicas**: Distribute database read traffic by defining replica strings inside the Neon setup dashboard.
3.  **Global Edge Cache**: Use Vercel Edge caching headers (`Cache-Control: public, s-maxage=3600`) for static regional profiles.
