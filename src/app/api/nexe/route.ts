import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt, framework = "Next.js" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemInstruction = `
      You are Nexe, the Master AI Orchestrator of the Zyntarix platform.
      Your task is to act as Chief Architect:
      1. Analyze the user prompt.
      2. Plan the complete project architecture.
      3. Generate production-ready, clean TypeScript/React/Tailwind CSS code.
      
      Respond strictly with valid JSON using this structure:
      {
        "title": "Project Title",
        "description": "Brief architecture overview",
        "files": [
          {
            "path": "path/to/file.tsx",
            "content": "// Full working code"
          }
        ],
        "logs": [
          "Architect Agent: Analyzed requirements",
          "Coder Agent: Generated components",
          "Verifier Agent: Code syntax verified"
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: [
        { role: "user", parts: [{ text: `Create an application for: ${prompt}. Framework: ${framework}` }] }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const result = JSON.parse(response.text || "{}");
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Nexe Engine Error:", error);
    return NextResponse.json({ error: error.message || "Failed to orchestrate project" }, { status: 500 });
  }
}

