const { createGoogleGenerativeAI } = require("@ai-sdk/google");
const { generateText } = require("ai");
require("dotenv").config();

async function main() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log("API Key loaded:", apiKey ? apiKey.substring(0, 10) + "..." : "undefined");
  if (!apiKey) {
    console.log("No API Key found.");
    return;
  }
  try {
    const google = createGoogleGenerativeAI({
      apiKey: apiKey
    });
    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: "Hello, reply with 'success' if you receive this.",
    });
    console.log("AI SDK Response:", text);
  } catch (error) {
    console.error("AI SDK Error:", error);
  }
}

main();
