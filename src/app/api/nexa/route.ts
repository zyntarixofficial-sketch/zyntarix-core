
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY?.trim() || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const { prompt, framework = "Next.js", userCredits = 50 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "API Configuration missing" }, { status: 500 });
    }

    // Using Google AI SDK with stable gemini-2.5-flash
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const systemPrompt = `
You are Nexa, the Master Deterministic Orchestration Engine of Zyntarix.
Synthesize complete, runnable, production-ready source code for an application matching user requirements.

RULES:
1. NO PLACEHOLDERS: Write complete Next.js React component with Tailwind CSS.
2. Return ONLY JSON conforming strictly to:
{
  "title": "Application Name",
  "description": "System summary",
  "steps": [
    { "agent": "nexa", "message": "Dispatched system specifications for build queue." },
    { "agent": "architect", "message": "Architect Node: Defined schema and component hierarchy." },
    { "agent": "coder", "message": "Core Coder: Generated deterministic React and Tailwind production code." },
    { "agent": "verifier", "message": "Sentinel Node: Verified AST trees, zero syntax errors." }
  ],
  "files": [
    {
      "path": "src/app/page.tsx",
      "content": "// Full working Next.js component..."
    }
  ]
}

User Prompt: "${prompt}"
Framework: ${framework}
    `;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    const data = JSON.parse(responseText || "{}");

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Nexa Direct Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate application source" },
      { status: 500 }
    );
  }
}
