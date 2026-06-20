const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

async function main() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log("API Key loaded:", apiKey ? apiKey.substring(0, 10) + "..." : "undefined");
  if (!apiKey) {
    console.log("No API Key found.");
    return;
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Hello, reply with 'success' if you receive this.",
    });
    console.log("Gemini Response:", response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

main();
