const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

async function main() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.log("No API Key found.");
    return;
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.list();
    const geminiModels = [];
    for (const m of response.modelsInternal) {
      if (m.name.includes("gemini")) {
        geminiModels.push({ name: m.name, displayName: m.displayName });
      }
    }
    console.log("Gemini Models:");
    console.log(geminiModels);
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

main();
