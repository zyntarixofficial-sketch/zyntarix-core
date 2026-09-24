
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, framework = "Next.js", userCredits = 50 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: "API Configuration missing" }, { status: 500 });
    }

    const systemInstruction = `
You are Nexa, the Master Deterministic Orchestration Engine of Zyntarix platform.
You convert software architecture blueprints into complete, verified, production-ready code.

RULES:
1. ZERO INCOMPLETE CODE: Never output placeholders or half-finished files. Write fully functional TypeScript, React, and Tailwind CSS code.
2. Return ONLY clean JSON without markdown code blocks, matching:
{
  "title": "Application Name",
  "description": "Short system summary",
  "creditsUsed": 5,
  "steps": [
    { "agent": "nexa", "message": "Dispatched system specifications for build queue." },
    { "agent": "architect", "message": "Architect Node: Defined state machines and layout hierarchy." },
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
`.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: `Generate full application code for: "${prompt}". Framework: ${framework}` }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      let rawText = data.candidates[0].content.parts[0].text.trim();
      if (rawText.startsWith("```json")) {
        rawText = rawText.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (rawText.startsWith("```")) {
        rawText = rawText.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const parsedData = JSON.parse(rawText);
      return NextResponse.json({ success: true, data: parsedData });
    }

    return NextResponse.json({ error: "Nexa node temporarily busy" }, { status: 503 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Pipeline execution failed" },
      { status: 500 }
    );
  }
}
