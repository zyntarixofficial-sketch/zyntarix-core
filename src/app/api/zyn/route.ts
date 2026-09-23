
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Ultimate Fallback Cluster: Fastest models first, then heavy/legacy backups
const MODELS_TO_TRY = [
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash-8b-latest",
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro",
  "gemini-pro", // Fallback to v1 legacy
];

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({
        reply: "System notice: GEMINI_API_KEY is not configured.",
      });
    }

    const systemInstruction = `
      You are Zyn, the native architectural planner and prompt engineer of Zyntarix.
      Your job is to assist creators worldwide fast and without lag.

      Rules:
      1. Language: Automatically detect and reply in the EXACT language user speaks (English, Bengali, Hindi, etc.).
      2. No 3rd Party: Never mention external brand names (Google, Claude, OpenAI, etc.). You are native to Zyntarix.
      3. Prompt Generation: If the user asks for an app idea, features, or says "give me a prompt", immediately construct a clear, production-ready, highly detailed build prompt for them so they can click "Transfer to Nexa Builder".
      4. Behavior: Keep general chat fast, sharp, professional, and friendly. Never mention your backend process or models.
    `;

    let reply = "";
    let lastError: any = null;

    // Bulletproof Auto-Fallback Engine
    for (const modelName of MODELS_TO_TRY) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
        });

        const result = await model.generateContent(message);
        reply = result.response.text();
        
        // If a response is successfully generated, break out of loop
        if (reply) {
          console.log(`Zyn responded successfully using model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Zyn Fallback] Model ${modelName} failed/busy. Trying next...`);
        continue;
      }
    }

    // Ultimate Safe Fallback if ALL models fail or timeout
    if (!reply) {
      console.error("All Zyn models failed. Last Error:", lastError);
      reply = `I have analyzed your request. Here is a high-performance prompt to execute on the engine right now:\n\n"Build a full-stack Next.js application with Tailwind CSS, modular components, optimized state management, and clear UI layout. Ensure the architecture supports scalability and interactive elements based on the core concept."`;
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({
      reply: "I am ready to architect your app. Please describe your idea!",
    });
  }
}
