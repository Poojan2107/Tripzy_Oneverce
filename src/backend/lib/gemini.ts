export function getGeminiApiKey(): string | undefined {
  const key =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

  if (!key || key === "your_gemini_api_key_here" || key === "MY_GEMINI_API_KEY") {
    return undefined;
  }

  if (!key.startsWith("AIzaSy")) {
    console.warn("[tripzy] Gemini API key does not match expected format (AIzaSy...). Using offline fallback.");
    return undefined;
  }

  return key;
}
