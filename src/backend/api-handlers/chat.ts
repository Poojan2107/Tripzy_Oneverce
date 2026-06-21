import { google } from "@ai-sdk/google";
import { streamText } from "ai";
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

    if (!getGeminiApiKey()) {
      return new Response(
        "Tripzy AI is running in offline mode. Add a GEMINI_API_KEY to your .env file to enable live responses.",
        { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages,
      system:
        "You are the Tripzy AI Travel Assistant. Your job is to help users discover, plan, and optimize their travel itineraries. Be helpful, concise, and prioritize recommending our featured and trending destinations. Provide budget breakdowns when asked.",
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
