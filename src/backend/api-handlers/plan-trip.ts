import { rankDestinations } from "../services/recommender";
import { getGeminiApiKey, GEMINI_FALLBACK_MODELS } from "../lib/gemini";
import { checkRateLimit } from "../lib/rate-limit";
import { GoogleGenAI } from "@google/genai";
import { buildOfflineResponse } from "../data/offlineItineraries";

async function callGeminiWithRetry(
  genAI: GoogleGenAI,
  models: string | string[],
  contents: any,
  config: any,
  retries = 1
): Promise<any> {
  const modelList = Array.isArray(models) ? models : [models];
  const TIMEOUT_MS = 30000;
  let lastError: any = null;

  for (const model of modelList) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const response = await genAI.models.generateContent({
          model,
          contents,
          config,
        });
        clearTimeout(timeout);
        return response;
      } catch (err: any) {
        clearTimeout(timeout);
        lastError = err;
        const is429 = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota');
        const is404 = err?.status === 404 || err?.message?.includes('404') || err?.message?.includes('not found');
        const isAbort = err?.name === 'AbortError';

        if (is429 || is404) {
          console.warn(`[Gemini plan-trip] Model '${model}' failed with rate limit/quota or not found. Trying next fallback model...`);
          break; // Break inner retry loop, try next model in modelList
        }
        if (isAbort || attempt >= retries) {
          break;
        }
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error("All Gemini fallback models failed");
}


function sanitizeServerInput(input: any, maxLength: number): string {
  if (typeof input !== 'string') return '';
  // 1. Remove control characters and null bytes
  let sanitized = input.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
  
  // 2. Strong Prompt Injection shield: detect and replace hijack phrases
  const injectionPatterns = [
    /ignore (all )?previous instructions/i,
    /forget (everything )?i told you/i,
    /you are now a/i,
    /system prompt/i,
    /act as a/i,
    /new instructions/i,
    /override/i,
    /system instruction/i,
  ];
  
  if (injectionPatterns.some(pattern => pattern.test(sanitized))) {
    return "Custom traveler preference";
  }
  
  return sanitized.trim().slice(0, maxLength);
}

export async function POST(req: Request) {
  let body: any = {};
  try {
    if (!(await checkRateLimit(req))) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const {
      destination, 
      fromLocation, 
      fromDate, 
      toDate, 
      budget, 
      budgetAmount,
      journeyMode, 
      travelStyle, 
      interests, 
      guests, 
      companion,
      travelPace,
      experience 
    } = body;

    // Sanitize user-supplied prompt input — strip control chars, truncate, prevent injection (SEC-04)
    const sanitizedDestination = sanitizeServerInput(destination, 100);
    const sanitizedFromLocation = sanitizeServerInput(fromLocation, 100);
    const sanitizedInterests = sanitizeServerInput(interests, 150);
    const sanitizedExperience = sanitizeServerInput(experience, 300);

    // 1. Calculate trip duration in days
    let tripDuration = 5;
    if (fromDate && toDate) {
      try {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) tripDuration = diffDays;
      } catch (err) {
        console.error("Failed to calculate trip duration:", err);
      }
    }
    tripDuration = Math.max(1, tripDuration);

    // 2. Determine travel month
    let travelMonth = undefined;
    if (fromDate) {
      try {
        const dateObj = new Date(fromDate);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        travelMonth = months[dateObj.getMonth()];
      } catch (err) {
        console.error("Failed to parse travel month:", err);
      }
    }

    // 3. Call the scoring engine
    const scoredDestinations = await rankDestinations({
      budget,
      duration: tripDuration,
      travelStyle,
      interests: sanitizedInterests,
      companion,
      guests,
      preferredRegion: sanitizedDestination || undefined,
      experience: sanitizedExperience,
      month: travelMonth
    });

    let finalDest = null;
    let matchDetails = null;

    if (scoredDestinations.length > 0) {
      // Find direct text match first if queried
      if (sanitizedDestination) {
        const exactMatch = scoredDestinations.find(
          (r) =>
            r.destination.name.toLowerCase().includes(sanitizedDestination.toLowerCase()) ||
            r.destination.city.toLowerCase().includes(sanitizedDestination.toLowerCase()) ||
            r.destination.country.toLowerCase().includes(sanitizedDestination.toLowerCase())
        );
        if (exactMatch) {
          finalDest = exactMatch.destination;
          matchDetails = exactMatch;
        }
      }

      // Default to highest scored destination
      if (!finalDest) {
        finalDest = scoredDestinations[0].destination;
        matchDetails = scoredDestinations[0];
      }
    }

    // 4. Guard budget amount against edge cases
    const safeBudgetAmount = Math.max(5000, (budgetAmount ?? 0) || 5000);

    // 5. Fallback mock response if no Gemini API Key is configured
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      const offlineResponse = buildOfflineResponse(finalDest, sanitizedDestination, budget, tripDuration, matchDetails, safeBudgetAmount, sanitizedExperience);
      return new Response(JSON.stringify(offlineResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 6. Construct prompt injecting DB destination context (RAG)
    const destName = finalDest ? finalDest.name : destination;
    const destDesc = finalDest ? finalDest.description : "A beautiful travel spot.";
    const centerLat = finalDest?.latitude ?? 20;
    const centerLng = finalDest?.longitude ?? 0;

    const prompt = `
      Create an immersive, premium day-by-day travel itinerary for a trip to ${destName}.
      
      Destination Knowledge Base Context:
      - Description: ${destDesc}
      - Country: ${finalDest?.country || 'N/A'}
      - Region: ${finalDest?.region || 'N/A'}
      - Baseline Coordinates: Latitude ${centerLat}, Longitude ${centerLng}
      
      Preferences:
      - Starting Location: ${sanitizedFromLocation}
      - Dates: ${fromDate} to ${toDate}
      - Budget Tier: ${budget}
      - Budget Amount (INR per person per day): ${safeBudgetAmount}
      - Travel Style: ${travelStyle}
      -       Key Interests: ---START---${sanitizedInterests}---END---
      - Travelers: ${guests}
      - Travel Pace: ${travelPace}
      
      Matched Recommendation Engine Telemetry:
      - Match Score: ${matchDetails?.score || 85}/100
      - Match Reasoning: ${matchDetails?.reasoning || 'N/A'}
      
      Cultural Context & Alignment Guidelines:
      - If ${destName} is an Indian destination (e.g. Varanasi, Taj Mahal, Ladakh, Goa, Udaipur, Kerala, Hampi, Jaisalmer), ensure the day-by-day description uses extremely rich, local, culturally immersive terminology (e.g. Backwaters, Haveli, Aarti, Toddy shops, Manganiyar folk musicians, coracle boats, bouldering trails). Avoid generic tourist descriptions.
      - Create highly authentic, detailed day-by-day logs with coordinate offsets of 0.001 to 0.05 around the baseline coordinates (Latitude: ${centerLat}, Longitude: ${centerLng}) for mapping, ensuring each day has slightly different coordinates representing specific spots.
      - Estimate realistic expenses in INR matching the budget level (Explorer, Curated Comfort, Floating Oases).
      
      Requirements:
      1. Provide a day-by-day itinerary (Day 1, Day 2, etc.) matching the travel dates and pace.
      2. For each day, provide the latitude and longitude coordinate points representing the highlight activity. Crucial: Make sure coordinates are geolocated reasonably around the destination center with offsets of 0.001 to 0.05, rather than returning the center exactly every day.
      3. Provide a realistic cost breakdown in INR matching the budget tier.
      4. Predict general weather for these dates at the destination.
      5. Suggest nearby places/attractions within a 10km radius.
    `;

    try {
      const genAI = new GoogleGenAI({ apiKey });
      const response = await callGeminiWithRetry(genAI, GEMINI_FALLBACK_MODELS, prompt, {
        responseMimeType: "application/json",
        responseSchema: {
            type: "object",
            properties: {
              itinerary: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    day: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    activities: { type: "array", items: { type: "string" } },
                    latitude: { type: "number" },
                    longitude: { type: "number" }
                  },
                  required: ["day", "title", "description", "activities", "latitude", "longitude"]
                }
              },
              costs: {
                type: "object",
                properties: {
                  transit: { type: "number" },
                  stay: { type: "number" },
                  food: { type: "number" },
                  total: { type: "number" }
                },
                required: ["transit", "stay", "food", "total"]
              },
              weather: {
                type: "object",
                properties: {
                  temperature: { type: "string" },
                  conditions: { type: "string" }
                },
                required: ["temperature", "conditions"]
              },
              nearbyPlaces: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    distance: { type: "string" },
                    description: { type: "string" }
                  },
                  required: ["name", "distance", "description"]
                }
              }
            },
            required: ["itinerary", "costs", "weather", "nearbyPlaces"]
          }
      });

      const data = JSON.parse(response.text);

      // Validate Gemini response schema structure to catch truncated or malformed payloads
      if (
        !data ||
        !Array.isArray(data.itinerary) ||
        data.itinerary.length === 0 ||
        !data.itinerary.every((item: any) => item && typeof item.day === 'string' && typeof item.title === 'string' && typeof item.description === 'string') ||
        !data.costs ||
        typeof data.costs.transit !== 'number' ||
        typeof data.costs.stay !== 'number' ||
        typeof data.costs.food !== 'number' ||
        typeof data.costs.total !== 'number' ||
        !data.weather ||
        typeof data.weather.temperature !== 'string' ||
        typeof data.weather.conditions !== 'string' ||
        !Array.isArray(data.nearbyPlaces)
      ) {
        throw new Error("Gemini response is missing required itinerary, costs, or weather schema elements");
      }

      const finalResponse = {
        ...data,
        destinationId: finalDest?.slug || finalDest?.id || undefined,
        destinationDbId: finalDest?.id || undefined,
        recommendationScore: matchDetails?.score || 85,
        recommendationReasoning: matchDetails?.reasoning || "Selected based on matching travel styles and budget guides.",
        matchedFactors: matchDetails?.matchedFactors || {
          budget: true,
          style: true,
          energy: true,
          season: true,
          companion: true
        }
      };

      return new Response(JSON.stringify(finalResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (aiError) {
      console.warn("Gemini API call failed, using offline fallback:", aiError);
      const offlineResponse = buildOfflineResponse(finalDest, sanitizedDestination, budget, tripDuration, matchDetails, budgetAmount, sanitizedExperience);
      return new Response(JSON.stringify(offlineResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    console.error("Trip Planning Route Error:", error);
    // Ultimate fallback: return offline itinerary even on unexpected errors
    try {
      const fallbackDest = (body as any)?.destination || "India";
      const fallbackBudget = (body as any)?.budget || 'Medium';
      const fallbackExp = (body as any)?.experience || "";
      const offlineResponse = buildOfflineResponse(null, sanitizeServerInput(fallbackDest, 100), fallbackBudget, 4, null, undefined, sanitizeServerInput(fallbackExp, 300));
      return new Response(JSON.stringify(offlineResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (fallbackErr) {
      console.error("Even offline fallback failed:", fallbackErr);
      const userMessage = "We couldn't complete your itinerary right now. Please try again in a moment.";
      return new Response(JSON.stringify({ error: userMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
