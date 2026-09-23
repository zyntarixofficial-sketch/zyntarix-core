import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Using only the most stable and available model identifiers
const MODELS_TO_TRY = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-pro"
];

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const systemInstruction = `
      You are Zyn, the native conversational co-pilot and system architect of Zyntarix.
      
      CORE BEHAVIOR:
      1. Default to professional English. If the user greets you (e.g. "Hi", "Hello", "Who are you?"), introduce yourself concisely as Zyn, the architect co-pilot of Zyntarix.
      2. If the user asks for an app idea, features, or says "give me a prompt", generate a high-performance build prompt with architecture specifications so they can send it to Nexa.
      3. Language: Always reply in the EXACT language the user typed in (e.g., if Bengali, reply in Bengali; if English, reply in English).
      4. Proprietary: NEVER mention third-party company names like Google or OpenAI.
    `;

    let reply = "";
    let realErrorMsg = "";

    if (apiKey) {
      for (const modelName of MODELS_TO_TRY) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction,
          });

          const result = await model.generateContent(message);
          reply = result.response.text();
          if (reply) break;
        } catch (err: any) {
          realErrorMsg = err.message;
          console.warn(`[Zyn] ${modelName} failed:`, err.message);
        }
      }
    } else {
      realErrorMsg = "GEMINI_API_KEY is missing in Render Environment.";
    }

    // Pure English Fallback without any hardcoded Bengali
    if (!reply) {
      reply = `Zyntarix Backend Alert ⚠️\nAll fallback nodes failed. The upstream API reported:\n\n"${realErrorMsg}"\n\nPlease wait a moment for the cluster to stabilize and try again.`;
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({
      reply: `System Fatal Error: ${error.message}`,
    });
  }
}
