import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "../lib/gemini";
import { checkRateLimit } from "../lib/rate-limit";
import { getSimulatedResponse } from "../lib/simulatedResponse";
import { detectIntent } from "../lib/intentDetector";
import { buildSystemPrompt } from "../lib/promptTemplates";
import { fetchUrlContent } from "../lib/contentFetcher";

async function callGeminiStreamWithTimeout(
  genAI: GoogleGenAI,
  model: string,
  contents: any,
  config: any,
  timeoutMs = 30000
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const stream = await genAI.models.generateContentStream({
      model,
      contents,
      config,
    });
    clearTimeout(timeout);
    return stream;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

export async function POST(req: Request) {
  try {
    if (!(await checkRateLimit(req))) {
      return new Response("Too many requests. Please try again shortly.", {
        status: 429,
      });
    }

    const { messages, preferences: savedPrefs } = await req.json();

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return new Response(
        "Travebie AI is running in offline mode. Add a GEMINI_API_KEY to your .env file to enable live responses.",
        { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    const genAI = new GoogleGenAI({ apiKey });
    const contents = messages
      .filter((m: any) => m.role !== 'system')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    // Detect user intent and build context-aware prompt
    const context = detectIntent(messages);

    // Merge saved preferences (from localStorage) into context
    if (savedPrefs) {
      if (savedPrefs.budgetTier && !context.budgetTier) context.budgetTier = savedPrefs.budgetTier;
      if (savedPrefs.travelerType && !context.travelerType) context.travelerType = savedPrefs.travelerType;
      if (savedPrefs.destination && context.destination === 'Goa') context.destination = savedPrefs.destination;
    }

    // If URL understanding intent, fetch the content
    if (context.intent === 'url_understanding' && context.extractedUrl) {
      const content = await fetchUrlContent(context.extractedUrl);
      if (content) context.extractedContent = content;
    }

    const systemPrompt = buildSystemPrompt(context);

    let stream;
    try {
      stream = await callGeminiStreamWithTimeout(
        genAI,
        "gemini-2.0-flash",
        contents,
        {
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          }
        }
      );
    } catch {
      // Gemini unavailable — serve a rich simulated response
      const simulated = getSimulatedResponse(messages);
      const encoder = new TextEncoder();
      const simulatedStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(simulated));
          controller.close();
        },
      });
      return new Response(simulatedStream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
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