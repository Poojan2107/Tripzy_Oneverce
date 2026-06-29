import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "../lib/gemini";
import { checkRateLimit } from "../lib/rate-limit";

export async function POST(req: Request) {
  try {
    if (!(await checkRateLimit(req))) {
      return new Response("Too many requests. Please try again shortly.", {
        status: 429,
      });
    }

    const { messages } = await req.json();

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

    const stream = await genAI.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: {
          parts: [{ text: "You are the Travebie AI Travel Assistant. Your job is to help users discover, plan, and optimize their travel itineraries. Be helpful, concise, and prioritize recommending our featured and trending destinations. Provide budget breakdowns when asked." }]
        }
      },
    });

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
    return new Response("Internal Server Error", { status: 500 });
  }
}