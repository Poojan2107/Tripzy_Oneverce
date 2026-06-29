# Tripzy Scenario Testing & Recovery Manual

This manual details the exact execution paths, expected outcomes, prevented failure states, and developer recovery procedures for real-world scenarios.

---

## Scenario A: End-to-End Successful Flow (Perfect Path)

### What Happens:
1. User landing on **Home** is presented with the 3D-tilting Hero Carousel.
2. User clicks **"Plan Your Journey"** to enter the **Companion** wizard.
3. Steps 1–5 are completed. User clicks **"Craft Journey"**.
4. The backend route `/api/plan-trip` queries the database, scores and ranks matching destinations, calls the Gemini model (`gemini-2.0-flash`), parses the JSON structure, and returns it.
5. The loading checklist ticks off completed steps dynamically.
6. The compiled journal is saved in **Neon PostgreSQL** via `saveItineraryAction` and added to the user's **Passport** timeline.
7. Deletions are animated smoothly using exit scales.

### What Does NOT Happen:
* **No Database Data Wipes**: User accounts and saved itineraries do not vanish during deployment recycles (since SQLite was replaced by hosted Postgres).
* **No UI Overlaps**: Sticky mobile headers do not push elements off the screen, and bottom bars do not hide footer copyrights.

### If It Fails:
* If the Gemini model takes longer than **12 seconds**, the client-side fetch controller aborts the request.
* **Code Recovery**: The catch block falls back to pre-authored premium offline logs and renders the itinerary instantly.
* **Developer Action**: Check Google AI Studio API quotas and model health.

---

## Scenario B: Neon PostgreSQL Database Outage

### What Happens:
1. User attempts to save an itinerary or register/sign in.
2. Prisma client fails to reach the cloud database, throwing a connection timeout error.
3. **Code Recovery**: The backend Server Actions (`saveItineraryAction`) capture the Prisma database connection exception within a `try-catch` block.
4. Instead of crashing the Next.js process, it returns `{ success: false, error: "Database unavailable" }`.
5. The frontend displays a warning alert: `"Could not save your journey. Check your connection and try again."`

### What Does NOT Happen:
* The user does not see a blank white screen, raw Prisma stack traces, or server-side internal error leaks.

### Developer Recovery Path:
1. Check the Neon PostgreSQL dashboard to verify server status.
2. Verify that the `.env` database connection string has not expired.
3. Inspect database pool limits (Next.js serverless functions open connections per invocation; ensure connection pooling is active using PgBouncer/Neon pooler links).

---

## Scenario C: Missing or Invalid Gemini API Key

### What Happens:
1. User requests a journey in the AI Planner.
2. `/api/plan-trip` executes `getGeminiApiKey()`. If the key is undefined or empty, the code bypasses calling GoogleGenAI entirely.
3. **Code Recovery**: The handler routes the request to the local fallback function:
   `const offlineResponse = buildOfflineResponse(finalDest, destination, budget, tripDuration, matchDetails, budgetAmount);`
4. The client receives a high-quality, pre-authored offline itinerary matching the selected destination (out of 12 seeded Indian chapters).

### What Does NOT Happen:
* The app does not hang, throw `API_KEY_INVALID` exceptions, or expose stack traces to the network console.

### Developer Recovery Path:
1. Ensure the `GEMINI_API_KEY` variable is correctly configured in your local `.env` and Vercel Deployment dashboards.
2. Redeploy the environment variables if modified.

---

## Scenario D: Rate Limiting & Bot Traffic

### What Happens:
1. A bot or user clicks the **"Craft Journey"** button multiple times in rapid succession, or spams the `/api/plan-trip` endpoint.
2. **Code Recovery**: The route handler checks traffic limits via Redis:
   `if (!(await checkRateLimit(req))) { return new Response(JSON.stringify({ error: "Too many requests..." }), { status: 429 }); }`
3. The server rejects excess calls with a `429 Too Many Requests` response.
4. The client stops the spinner and alerts the user.

### What Does NOT Happen:
* Gemini API quotas are not exhausted by spam attacks, protecting your project from sudden billing spikes or complete service suspensions.

### Developer Recovery Path:
1. Review the Upstash Redis console to inspect rate limits and active IP counts.
2. Adjust rate thresholds in `src/backend/lib/rate-limit.ts` if real user volume increases.
