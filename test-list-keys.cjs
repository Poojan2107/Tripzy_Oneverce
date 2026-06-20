const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

async function main() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.list();
    // Print keys of response
    console.log("Keys:", Object.keys(response));
    
    // Check if it is an array or has a models property
    if (Array.isArray(response)) {
      console.log("It is an array of size:", response.length);
    } else {
      // Let's find any array properties
      for (const k of Object.keys(response)) {
        if (Array.isArray(response[k])) {
          console.log(`Property ${k} is array of size ${response[k].length}`);
          const firstFew = response[k].slice(0, 5).map(m => m.name || m);
          console.log("First few:", firstFew);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
