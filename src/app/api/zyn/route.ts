
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Only 100% valid Google production models
const MODELS_TO_TRY = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
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
      1. If the user asks general questions (e.g. "Who are you?", "Hi", greetings), respond naturally and explain that you are Zyn, the architect co-pilot of Zyntarix.
      2. If the user asks for an app idea, features, or says "give me a prompt", generate a high-performance build prompt with architecture specifications so they can send it to Nexa.
      3. Language: Always reply in the user's input language.
      4. Proprietary: NEVER mention third-party company names.
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
          realErrorMsg = err.message; // Capturing the EXACT error from Google
          console.warn(`[Zyn] ${modelName} failed:`, err.message);
        }
      }
    } else {
      realErrorMsg = "GEMINI_API_KEY is missing in Render Environment.";
    }

    // If ALL models fail, show the exact Google Error to the user
    if (!reply) {
      reply = `Zyntarix Backend Error ⚠️\nসবগুলো ব্যাকআপ ফেইল করেছে! গুগল এপিআই থেকে এই সমস্যাটি আসছে:\n\n"${realErrorMsg}"\n\nএই মেসেজটি দেখে আমরা বুঝতে পারবো API Key এর লিমিট শেষ নাকি অন্য কোনো সমস্যা!`;
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({
      reply: `Fatal Server Error: ${error.message}`,
    });
  }
}
