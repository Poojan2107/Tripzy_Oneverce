"use server";

import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "./gemini";

export async function generateDestinationDescription(name: string, city: string, country: string, keywords: string): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return "AI generation unavailable (API key not configured).";

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a senior travel copywriter for Travebie, a premium travel platform showcasing Indian destinations.

Write a rich, evocative destination description for "${name}" in ${city}, ${country}.

**Style guidelines:**
- Use vivid sensory language (sights, sounds, smells, textures)
- Include specific local details (neighborhoods, landmarks, cuisine)
- Mention the best time to visit and ideal traveler type
- Use markdown formatting: **bold** for key highlights, *italic* for atmospheric details
- Keep it 150-250 words
- Do NOT use clichés like "hidden gem", "nestled in", "tapestry of", "breathtaking views"

**Additional keywords to include naturally:** ${keywords || "culture, food, scenic beauty"}

Write only the description, no preamble or title.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 600,
      },
    });
    return response.text ?? "";
  } catch (error) {
    console.error("AI description generation failed:", error);
    return "Failed to generate description. Please try again.";
  }
}

export async function generateExperienceDescription(name: string, keywords: string): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return "AI generation unavailable (API key not configured).";

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a senior travel copywriter for Travebie, a premium travel platform.

Write a compelling experience description for "${name}".

**Style guidelines:**
- Describe the mood, vibe, and who this experience is for
- Mention specific activities the traveler will enjoy
- Use markdown formatting: **bold** for highlights
- Keep it 80-150 words
- Do NOT use clichés like "hidden gem", "nestled in", "tapestry of"

**Additional keywords to include naturally:** ${keywords || "adventure, discovery"}

Write only the description, no preamble or title.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 400,
      },
    });
    return response.text ?? "";
  } catch (error) {
    console.error("AI description generation failed:", error);
    return "Failed to generate description. Please try again.";
  }
}
