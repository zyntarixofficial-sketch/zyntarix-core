
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { prompt, framework = "Next.js" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const systemPrompt = `
      You are Nexe, the Master AI Orchestrator of the Zyntarix platform.
      Respond strictly with valid JSON using this structure:
      {
        "title": "Project Title",
        "description": "Brief architecture overview",
        "files": [
          {
            "path": "src/app/page.tsx",
            "content": "// Full working code"
          }
        ]
      }
      Target Framework: ${framework}.
      User prompt: ${prompt}
    `;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();
    const data = JSON.parse(text || "{}");

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Nexe Engine Error:", error);
    return NextResponse.json({ error: error.message || "Failed to orchestrate" }, { status: 500 });
  }
}
