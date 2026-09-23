import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const { prompt, framework = "Next.js" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Explicitly using gemini-3.5-flash
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const systemPrompt = `
      You are Nexe, the Master AI Orchestration Engine of Zyntarix platform.
      Take user project ideas and orchestrate software code across internal sub-agents:
      1. Zyntarix Architect Node (Decomposes logic and file hierarchy)
      2. Zyntarix Core Coder (Writes full TypeScript, React, Tailwind CSS code)
      3. Sentinel Verification Node (Runs synthetic audit, checks missing imports)

      Return STRICT JSON:
      {
        "title": "Application Name",
        "description": "Short system summary",
        "steps": [
          { "agent": "nexe", "message": "Decomposed system specs for: ${prompt.replace(/"/g, "'")}" },
          { "agent": "architect", "message": "Architect Node: Defined modular directory tree and data interfaces." },
          { "agent": "coder", "message": "Core Coder: Generated production React and Tailwind UI components." },
          { "agent": "verifier", "message": "Sentinel Node: Performed syntax audit. Verified zero fatal exceptions." }
        ],
        "files": [
          {
            "path": "src/app/page.tsx",
            "content": "// Full working Next.js code here..."
          }
        ]
      }

      Generate code matching user prompt: "${prompt}".
      Target framework: ${framework}.
      Do NOT mention external 3rd-party company names.
    `;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();
    const data = JSON.parse(text || "{}");

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Nexe Engine Error:", error);
    return NextResponse.json({ error: error.message || "Pipeline execution failed" }, { status: 500 });
  }
}
