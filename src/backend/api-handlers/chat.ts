import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey, GEMINI_FALLBACK_MODELS } from "../lib/gemini";
import { checkRateLimit } from "../lib/rate-limit";
import { getSimulatedResponse } from "../lib/simulatedResponse";
import { detectIntent, Intent } from "../lib/intentDetector";
import { buildNewTripSystemPrompt, buildFollowUpSystemPrompt } from "../lib/promptTemplates";
import { fetchUrlContent } from "../lib/contentFetcher";
import { getSession, saveSession, TripSession } from "../lib/sessionStore";
import { pruneItineraryForContext, mergeItineraryPatch } from "../lib/smartContext";
import { z } from "zod";

function sanitizeServerInput(input: any, maxLength: number): string {
  if (typeof input !== 'string') return '';
  let sanitized = input.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
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

const dayItemSchema = z.object({
  day: z.number(),
  title: z.string().optional(),
  morning: z.array(z.string()).optional(),
  afternoon: z.array(z.string()).optional(),
  evening: z.array(z.string()).optional(),
  places: z.array(z.any()).optional(),
  restaurants: z.array(z.any()).optional(),
  hotels: z.array(z.any()).optional(),
  weather: z.string().optional(),
  aiTips: z.array(z.string()).optional(),
}).passthrough();

const tripDataSchema = z.object({
  hero: z.object({
    destination: z.string().optional(),
    coverImageQuery: z.string().optional(),
    tripDuration: z.string().optional(),
    travelMode: z.string().optional(),
    bestTimeToVisit: z.string().optional(),
    estimatedBudget: z.string().optional(),
    tripSummary: z.string().optional(),
  }).passthrough().optional(),
  overview: z.object({
    startLocation: z.string().optional(),
    destination: z.string().optional(),
    totalDistance: z.string().optional(),
    totalTravelTime: z.string().optional(),
    currency: z.string().optional(),
    languages: z.array(z.string()).optional(),
    weatherSummary: z.string().optional(),
    bestSeason: z.string().optional(),
    tripType: z.string().optional(),
    difficulty: z.string().optional(),
    estimatedDailyCost: z.string().optional(),
    totalCost: z.string().optional(),
    travelStyle: z.string().optional(),
  }).passthrough().optional(),
  route: z.object({
    mapSummary: z.string().optional(),
    majorStops: z.array(z.string()).optional(),
  }).passthrough().optional(),
  days: z.array(dayItemSchema).optional(),
  expenseCalculator: z.object({
    fuel: z.string().optional(),
    hotel: z.string().optional(),
    food: z.string().optional(),
    activities: z.string().optional(),
    shopping: z.string().optional(),
    miscellaneous: z.string().optional(),
    estimatedTotal: z.string().optional(),
  }).passthrough().optional(),
  packingChecklist: z.array(z.string()).optional(),
  localFoods: z.array(z.string()).optional(),
  shoppingPlaces: z.array(z.string()).optional(),
  emergencyContacts: z.object({
    police: z.string().optional(),
    ambulance: z.string().optional(),
    touristHelpline: z.string().optional(),
  }).passthrough().optional(),
  faqs: z.array(z.object({
    question: z.string().optional(),
    answer: z.string().optional(),
  }).passthrough()).optional(),
}).passthrough();

const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.string(),
    content: z.string().max(100000),
  })).min(1),
  preferences: z.any().optional(),
  sessionId: z.string().max(200).nullable().optional(),
  currentTrip: z.any().nullable().optional(),
});

async function callGeminiStreamWithTimeout(
  genAI: GoogleGenAI,
  models: string | string[],
  contents: any,
  config: any,
  timeoutMs = 25000
) {
  const modelList = Array.isArray(models) ? models : [models];
  let lastError: any = null;

  for (const model of modelList) {
    try {
      const streamPromise = genAI.models.generateContentStream({
        model,
        contents,
        config,
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Gemini stream timed out after ${timeoutMs}ms for ${model}`)), timeoutMs)
      );
      const stream = await Promise.race([streamPromise, timeoutPromise]);
      return stream;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini stream] Model '${model}' failed: ${err?.message || err}. Trying next fallback model...`);
    }
  }

  throw lastError || new Error("All Gemini models failed");
}

const chatResponseSchema = {
  type: "object",
  properties: {
    hero: {
      type: "object",
      properties: {
        destination: { type: "string" },
        coverImageQuery: { type: "string" },
        tripDuration: { type: "string" },
        travelMode: { type: "string" },
        bestTimeToVisit: { type: "string" },
        estimatedBudget: { type: "string" },
        tripSummary: { type: "string" }
      },
      required: ["destination", "coverImageQuery", "tripDuration", "travelMode", "bestTimeToVisit", "estimatedBudget", "tripSummary"]
    },
    overview: {
      type: "object",
      properties: {
        startLocation: { type: "string" },
        destination: { type: "string" },
        totalDistance: { type: "string" },
        totalTravelTime: { type: "string" },
        currency: { type: "string" },
        languages: { type: "array", items: { type: "string" } },
        weatherSummary: { type: "string" },
        bestSeason: { type: "string" },
        tripType: { type: "string" },
        difficulty: { type: "string" },
        estimatedDailyCost: { type: "string" },
        totalCost: { type: "string" },
        travelStyle: { type: "string" }
      },
      required: ["startLocation", "destination", "totalDistance", "totalTravelTime", "currency", "languages", "weatherSummary", "bestSeason", "tripType", "difficulty", "estimatedDailyCost", "totalCost", "travelStyle"]
    },
    route: {
      type: "object",
      properties: {
        mapSummary: { type: "string" },
        majorStops: { type: "array", items: { type: "string" } }
      },
      required: ["mapSummary", "majorStops"]
    },
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "integer" },
          title: { type: "string" },
          morning: { type: "array", items: { type: "string" } },
          afternoon: { type: "array", items: { type: "string" } },
          evening: { type: "array", items: { type: "string" } },
          places: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                visitDuration: { type: "string" },
                entryFee: { type: "string" },
                openingHours: { type: "string" },
                rating: { type: "string" },
                coordinates: {
                  type: "object",
                  properties: {
                    lat: { type: "string" },
                    lng: { type: "string" }
                  },
                  required: ["lat", "lng"]
                },
                imageQueries: { type: "array", items: { type: "string" } },
                googleMapsSearch: { type: "string" }
              },
              required: ["name", "description", "visitDuration", "entryFee", "openingHours", "rating", "coordinates", "imageQueries", "googleMapsSearch"]
            }
          },
          restaurants: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                reason: { type: "string" }
              },
              required: ["name", "reason"]
            }
          },
          hotels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                budgetType: { type: "string" },
                reason: { type: "string" }
              },
              required: ["name", "budgetType", "reason"]
            }
          },
          fuelStops: { type: "array", items: { type: "string" } },
          weather: { type: "string" },
          aiTips: { type: "array", items: { type: "string" } }
        },
        required: ["day", "title", "morning", "afternoon", "evening", "places", "restaurants", "hotels", "weather", "aiTips"]
      }
    },
    expenseCalculator: {
      type: "object",
      properties: {
        fuel: { type: "string" },
        hotel: { type: "string" },
        food: { type: "string" },
        activities: { type: "string" },
        shopping: { type: "string" },
        miscellaneous: { type: "string" },
        estimatedTotal: { type: "string" }
      },
      required: ["fuel", "hotel", "food", "activities", "shopping", "miscellaneous", "estimatedTotal"]
    },
    packingChecklist: { type: "array", items: { type: "string" } },
    localFoods: { type: "array", items: { type: "string" } },
    shoppingPlaces: { type: "array", items: { type: "string" } },
    emergencyContacts: {
      type: "object",
      properties: {
        police: { type: "string" },
        ambulance: { type: "string" },
        touristHelpline: { type: "string" }
      },
      required: ["police", "ambulance", "touristHelpline"]
    },
    faqs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "answer"]
      }
    }
  },
  required: ["hero", "overview", "route", "days", "expenseCalculator", "packingChecklist", "localFoods", "shoppingPlaces", "emergencyContacts", "faqs"]
};

function shouldForceJson(context: any): boolean {
  if (context.intent === "GENERAL_CHAT" || context.intent === "ASK_QUESTION") {
    return false;
  }
  if (context.isFollowUp && (context.intent === "OTHER" || context.intent === "GENERAL_CHAT")) {
    return false;
  }
  return true;
}

// Patch response schema — all fields optional, allows partial JSON patches for follow-ups
const patchResponseSchema = {
  type: "object",
  properties: {
    hero: {
      type: "object",
      properties: {
        destination: { type: "string" },
        coverImageQuery: { type: "string" },
        tripDuration: { type: "string" },
        travelMode: { type: "string" },
        bestTimeToVisit: { type: "string" },
        estimatedBudget: { type: "string" },
        tripSummary: { type: "string" }
      }
    },
    overview: {
      type: "object",
      properties: {
        startLocation: { type: "string" },
        destination: { type: "string" },
        totalDistance: { type: "string" },
        totalTravelTime: { type: "string" },
        currency: { type: "string" },
        languages: { type: "array", items: { type: "string" } },
        weatherSummary: { type: "string" },
        bestSeason: { type: "string" },
        tripType: { type: "string" },
        difficulty: { type: "string" },
        estimatedDailyCost: { type: "string" },
        totalCost: { type: "string" },
        travelStyle: { type: "string" }
      }
    },
    route: {
      type: "object",
      properties: {
        mapSummary: { type: "string" },
        majorStops: { type: "array", items: { type: "string" } }
      }
    },
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "integer" },
          title: { type: "string" },
          morning: { type: "array", items: { type: "string" } },
          afternoon: { type: "array", items: { type: "string" } },
          evening: { type: "array", items: { type: "string" } },
          places: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                visitDuration: { type: "string" },
                entryFee: { type: "string" },
                openingHours: { type: "string" },
                rating: { type: "string" },
                coordinates: {
                  type: "object",
                  properties: {
                    lat: { type: "string" },
                    lng: { type: "string" }
                  }
                },
                imageQueries: { type: "array", items: { type: "string" } },
                googleMapsSearch: { type: "string" }
              }
            }
          },
          restaurants: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                reason: { type: "string" }
              }
            }
          },
          hotels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                budgetType: { type: "string" },
                reason: { type: "string" }
              }
            }
          },
          fuelStops: { type: "array", items: { type: "string" } },
          weather: { type: "string" },
          aiTips: { type: "array", items: { type: "string" } }
        }
      }
    },
    expenseCalculator: {
      type: "object",
      properties: {
        fuel: { type: "string" },
        hotel: { type: "string" },
        food: { type: "string" },
        activities: { type: "string" },
        shopping: { type: "string" },
        miscellaneous: { type: "string" },
        estimatedTotal: { type: "string" }
      }
    },
    packingChecklist: { type: "array", items: { type: "string" } },
    localFoods: { type: "array", items: { type: "string" } },
    shoppingPlaces: { type: "array", items: { type: "string" } },
    emergencyContacts: {
      type: "object",
      properties: {
        police: { type: "string" },
        ambulance: { type: "string" },
        touristHelpline: { type: "string" }
      }
    },
    faqs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          answer: { type: "string" }
        }
      }
    }
  }
};

function buildConversationSummaryFallback(session: TripSession): string {
  const dest = session.sessionState?.destination || session.currentTrip?.hero?.destination || "destination";
  const days = session.sessionState?.days || "";
  const budget = session.sessionState?.budget || "";
  const completed = session.sessionState?.completed || [];
  const pending = session.sessionState?.pending || [];

  let summary = `User is planning a trip to ${dest}.`;
  if (days) summary += ` Duration: ${days} days.`;
  if (budget) summary += ` Budget: ${budget}.`;
  if (completed.length > 0) summary += ` Completed: ${completed.join(", ")}.`;
  if (pending.length > 0) summary += ` Pending: ${pending.join(", ")}.`;

  return summary;
}

// Inline helper to update structured session state and conversation summary using Gemini
async function updateSessionSummaryAndState(
  session: TripSession,
  lastUserMsg: string,
  lastAssistantResponse: string,
  apiKey: string
): Promise<{ conversationSummary: string; sessionState: any } | null> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a travel planning state machine. Your task is to update the Conversation Summary and Session State based on the latest exchange.

Current Conversation Summary:
"${session.conversationSummary || "No summary yet."}"

Current Session State:
${JSON.stringify(session.sessionState || {}, null, 2)}

Latest User Message: "${lastUserMsg}"
Latest Assistant Response: "${lastAssistantResponse.slice(0, 1000)}..."

Produce an updated JSON object containing:
1. "conversationSummary": A concise 2-3 sentence summary of the user's travel goal, current status, and topic of discussion.
2. "sessionState": A structured state object with fields:
   - "destination": string
   - "days": number or null
   - "budget": string
   - "travelStyle": string
   - "travelerType": string
   - "completed": array of strings (list of items completed/finalized, e.g., ["Itinerary", "Hotels", "Beaches"])
   - "pending": array of strings (list of items pending, e.g., ["Restaurants", "Packing"])

Return ONLY a valid JSON object matching this structure. Do not wrap in markdown code blocks.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 500,
      },
    });

    if (response.text) {
      const clean = response.text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      return JSON.parse(clean);
    }
  } catch (e) {
    console.error("[sessionStateUpdate] failed:", e);
  }

  // Fallback if AI call fails
  try {
    const updatedState = { ...(session.sessionState || {}) };
    if (session.currentTrip?.hero?.destination) updatedState.destination = session.currentTrip.hero.destination;
    if (session.currentTrip?.hero?.tripDuration) {
      const match = session.currentTrip.hero.tripDuration.match(/(\d+)/);
      if (match) updatedState.days = parseInt(match[1], 10);
    }
    if (session.currentTrip?.hero?.estimatedBudget) updatedState.budget = session.currentTrip.hero.estimatedBudget;
    return {
      conversationSummary: session.conversationSummary || `User is planning a trip to ${updatedState.destination || "destination"}.`,
      sessionState: updatedState
    };
  } catch {
    return null;
  }
}

// Background session post-processing when stream completes
async function handleSessionPostProcessing(
  sessionId: string,
  fullGeneratedText: string,
  lastUserMsg: string,
  apiKey: string
) {
  try {
    const session = await getSession(sessionId);

    // 1. Append exchanges
    if (!session.recentMessages) session.recentMessages = [];
    session.recentMessages.push({ role: "user", content: lastUserMsg });
    session.recentMessages.push({ role: "assistant", content: fullGeneratedText });

    // 2. Parse and merge JSON
    const trimmed = fullGeneratedText.trim();
    const clean = trimmed.replace(/^```json\s*/i, "").replace(/```$/, "").trim();

    if (clean.startsWith("{")) {
      try {
        const json = JSON.parse(clean);
        const isFullTrip = json.hero && json.days && json.overview;
        if (isFullTrip) {
          session.currentTrip = json;
        } else if (session.currentTrip) {
          session.currentTrip = mergeItineraryPatch(session.currentTrip, json);
        } else {
          session.currentTrip = json;
        }
      } catch (e) {
        console.error("[post-processing] merge JSON failed:", e);
      }
    }

    // 3. Update structured state locally (fast and rate-limit safe)
    if (session.currentTrip) {
      const state = session.sessionState || {
        destination: "",
        days: null,
        budget: "",
        travelStyle: "",
        travelerType: "",
        completed: [],
        pending: ["Itinerary", "Hotels", "Restaurants", "Packing"]
      };

      if (session.currentTrip.hero?.destination) state.destination = session.currentTrip.hero.destination;
      if (session.currentTrip.hero?.tripDuration) {
        const match = session.currentTrip.hero.tripDuration.match(/(\d+)/);
        if (match) state.days = parseInt(match[1], 10);
      }
      if (session.currentTrip.hero?.estimatedBudget) state.budget = session.currentTrip.hero.estimatedBudget;
      if (session.currentTrip.overview?.travelStyle) state.travelStyle = session.currentTrip.overview.travelStyle;

      // Local completion tracking
      const messages = session.recentMessages;
      const context = detectIntent(messages, true);

      if (context.intent === "NEW_TRIP") {
        state.completed = ["Itinerary"];
        state.pending = ["Hotels", "Restaurants", "Activities", "Packing"];
      } else {
        if (context.intent === "CHANGE_HOTEL" && !state.completed.includes("Hotels")) {
          state.completed.push("Hotels");
        }
        if (context.intent === "CHANGE_RESTAURANT" && !state.completed.includes("Restaurants")) {
          state.completed.push("Restaurants");
        }
        if ((context.intent === "ADD_ACTIVITY" || context.intent === "UPDATE_DAY") && !state.completed.includes("Itinerary")) {
          state.completed.push("Itinerary");
        }
        state.pending = ["Itinerary", "Hotels", "Restaurants", "Packing"].filter(p => !state.completed.includes(p));
      }

      session.sessionState = state;
    }

    // 4. Conversation Compression: every 5 turns (10 messages)
    const turnCount = session.recentMessages.length;
    if (turnCount >= 10) {
      console.log("[post-processing] Triggering conversation compression (turn count:", turnCount / 2, ")...");
      const summaryResult = await updateSessionSummaryAndState(session, lastUserMsg, fullGeneratedText, apiKey);
      if (summaryResult) {
        session.conversationSummary = summaryResult.conversationSummary;
        session.sessionState = summaryResult.sessionState;
      } else {
        session.conversationSummary = buildConversationSummaryFallback(session);
      }
      session.recentMessages = session.recentMessages.slice(-4); // keep last 2 exchanges
    } else {
      if (!session.conversationSummary) {
        session.conversationSummary = buildConversationSummaryFallback(session);
      }
    }

    await saveSession(session);
  } catch (e) {
    console.error("[post-processing] failed:", e);
  }
}

function cleanHistoryForGemini(messages: any[]): any[] {
  return messages.map((m: any) => {
    const content = m.content.trim();
    const clean = content.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    if (clean.startsWith('{')) {
      try {
        const parsed = JSON.parse(clean);
        if (parsed.hero || parsed.itinerary || parsed.days) {
          const destName = parsed.hero?.destination || parsed.destination || "destination";
          return {
            role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
            parts: [{ text: `[Generated trip plan for ${destName}]` }]
          };
        }
      } catch { }
    }
    return {
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }]
    };
  });
}

export async function POST(req: Request) {
  try {
    if (!(await checkRateLimit(req))) {
      return new Response("Too many requests. Please try again shortly.", {
        status: 429,
      });
    }

    const parsed = chatRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid request body", details: parsed.error.issues }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { messages, preferences: savedPrefs, sessionId: bodySessionId } = parsed.data;
    let clientCurrentTrip = parsed.data.currentTrip || null;

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return new Response(
        "Travebie AI is running in offline mode. Add a GEMINI_API_KEY to your .env file to enable live responses.",
        { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    const apiMessages = messages.filter((m: any) => m.role !== 'system');
    const lastUserMsg = apiMessages.length > 0 ? sanitizeServerInput(apiMessages[apiMessages.length - 1].content, 10000) : "";

    // 1. Session Retrieval
    const sessionId = bodySessionId || `session_${crypto.randomUUID()}`;
    const session = await getSession(sessionId);

    // Sync client's current trip if it was passed
    if (clientCurrentTrip) {
      session.currentTrip = clientCurrentTrip;
    }

    const currentTrip = session.currentTrip;

    // 2. Intent Detection
    const context = detectIntent(apiMessages, !!currentTrip);

    // Merge saved preferences into context
    if (savedPrefs) {
      if (savedPrefs.budgetTier && !context.budgetTier) context.budgetTier = savedPrefs.budgetTier;
      if (savedPrefs.travelerType && !context.travelerType) context.travelerType = savedPrefs.travelerType;
      if (savedPrefs.destination && context.destination === 'Goa') context.destination = savedPrefs.destination;
    }

    // Fetch URL contents if needed
    if (context.intent === 'NEW_TRIP' && context.extractedUrl) {
      const content = await fetchUrlContent(context.extractedUrl);
      if (content) context.extractedContent = content;
    }

    // 3. Smart Context Pruning
    const prunedTrip = currentTrip ? pruneItineraryForContext(currentTrip, context.intent, lastUserMsg) : null;

    // 4. Prompt Selection
    let systemPrompt = "";
    if (context.isFollowUp && currentTrip) {
      systemPrompt = buildFollowUpSystemPrompt(context, session.sessionState, session.conversationSummary || "");
    } else {
      systemPrompt = buildNewTripSystemPrompt(context);
    }

    // 5. Build Content Payload
    // - Keep last 3 exchanges as conversation history
    // - Inject pruned trip as a system-context message (not in system instruction)
    const recentApiMessages = apiMessages.slice(0, -1).slice(-6);
    const contents = [
      ...cleanHistoryForGemini(recentApiMessages),
    ];

    // Inject the pruned trip as a separate context message (keeps system prompt lean)
    if (prunedTrip) {
      contents.push({
        role: 'user',
        parts: [{ text: `[Current Itinerary State]:\n${JSON.stringify(prunedTrip, null, 2)}\n\nUse this as reference. Do not regenerate the full trip unless asked.` }]
      });
    }

    // Add the actual user message
    contents.push({
      role: 'user',
      parts: [{ text: lastUserMsg }]
    });

    const forceJson = shouldForceJson(context);

    const config: any = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    };

    if (forceJson) {
      config.responseMimeType = "application/json";
      // Use patch schema for follow-ups; full schema ONLY for fresh NEW_TRIP
      if ((context.isFollowUp || currentTrip) && context.intent !== "NEW_TRIP") {
        config.responseSchema = patchResponseSchema;
      } else {
        config.responseSchema = chatResponseSchema;
      }
    }
    const genAI = new GoogleGenAI({ apiKey });
    let stream;
    try {
      stream = await callGeminiStreamWithTimeout(
        genAI,
        GEMINI_FALLBACK_MODELS,
        contents,
        config
      );
    } catch (e) {
      console.error("Gemini stream failed, using simulation fallback:", e);
      const simulated = getSimulatedResponse(messages);
      const offlinePrefix = "[⚡ Offline Mode] Your AI companion is currently offline. Here's a sample itinerary:\n\n";

      // Run background post-processing on the simulated response to write session state
      await handleSessionPostProcessing(sessionId, simulated, lastUserMsg, apiKey);

      const encoder = new TextEncoder();
      const simulatedStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(offlinePrefix + simulated));
          controller.close();
        },
      });
      return new Response(simulatedStream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const encoder = new TextEncoder();
    let fullGeneratedText = "";
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.text) {
              fullGeneratedText += chunk.text;
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          // Intercept stream completion and run session post-processing in background
          await handleSessionPostProcessing(sessionId, fullGeneratedText, lastUserMsg, apiKey);
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("I'm having trouble connecting right now. Please try again in a moment.", { status: 200 });
  }
}