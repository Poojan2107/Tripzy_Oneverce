# Tripzy AI Reliability Report

This report evaluates the reliability, failure modes, prompt construction, and offline fallbacks of the AI-powered itinerary generation engine in Tripzy.

---

## 1. AI Integration Architecture

### Core Components
- **Model**: `gemini-2.0-flash`
- **SDK**: `@google/genai` (version `2.4.0`)
- **Key Location**: `src/backend/api-handlers/plan-trip.ts`
- **Configuration Utility**: `src/backend/lib/gemini.ts`

### Prompt Engineering & RAG Context
When a user requests a journey via the Companion planner, the system performs a localized search in the database for the selected destination. The prompt dynamically injects:
1. **Destination Metadata**: Title, description, region, country, and baseline lat/lng.
2. **User Preferences**: Start location, travel dates, budget tier/amount, style, interests, guests, and pace.
3. **Telemetry**: Match scores and reasoning calculated from the matching engine.
4. **Cultural Guidelines**: Strict instructions to write culturally authentic day-by-day logs rather than generic tourist copy.
5. **Coordinate Anchoring**: Mandates that day-by-day coordinate points be offset slightly (0.001 to 0.05) from the baseline lat/lng to enable clean mapping.

---

## 2. Robustness and Failure Mode Analysis

The route handler implements structural safeguards to handle various AI failure modes:

| Failure Scenario | Guard / Recovery Path | User Impact |
| :--- | :--- | :--- |
| **Malformed JSON** | Schema enforcement is requested at the API level using `responseMimeType: "application/json"` and a strict `responseSchema` defining all required fields. If parsing fails, the catch block triggers. | **None**: Fallback offline itinerary is served instantly. |
| **Timeout / Unavailability** | The catch block logs the error and immediately redirects the flow to `buildOfflineResponse`. | **None**: Fallback offline itinerary is served instantly. |
| **Partial / Empty Output** | Because `responseSchema` requires fields (`itinerary`, `costs`, `weather`, `nearbyPlaces`), the Gemini engine will return complete objects. In cases of partial responses that fail to parse, the catch block catches the JSON exception and triggers fallback. | **None**: Fallback offline itinerary is served instantly. |
| **Rate Limiting** | Checked at the start of `/api/plan-trip` using `checkRateLimit(req)` backed by Upstash Redis. If the limit is exceeded, a `429` status is returned. | **Low**: User sees a "Too many requests. Please try again shortly." message. |

---

## 3. Offline Fallbacks & Local Datastores

When the API key is not configured (or is invalid), or when Gemini calls fail, the system falls back to `buildOfflineResponse` which retrieves pre-authored premium offline itineraries from `getBaseOfflineItinerary`.
- **Coverage**: Pre-authored itineraries cover all 12 living chapters (Varanasi, Kerala, Ladakh, Jaisalmer, Udaipur, Kashmir, Munnar, Goa, Hampi, Kutch, Cherrapunji, Andaman).
- **Quality**: The offline fallbacks contain highly descriptive, day-by-day itineraries, coordinate offsets, and cost estimates modeled around the user's budget.
- **Fail-Safe**: If an unexpected exception occurs, the catch-all handler returns a default Indian offline itinerary rather than crashing the client.

---

## 4. Key Recommendations

1. **Shorten Timeout Limits**: Currently, the handler waits for Gemini's default timeout (which can be up to 30 seconds). A custom timeout (e.g. 8–10 seconds) should be configured on the client or API fetch call to prevent hanging loaders.
2. **Offline Itinerary Expansion**: If new destinations are added to the database, their respective offline mock itineraries must be added to `plan-trip.ts` to ensure 100% fallback coverage.
