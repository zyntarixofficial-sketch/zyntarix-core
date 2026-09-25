
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

    const systemPrompt = `You are Nexa, the Master Deterministic Orchestration Engine of Zyntarix.
Synthesize a complete, full-page, beautiful Next.js application in TypeScript with React and Tailwind CSS matching the user request.
Never return placeholders or incomplete components.
Return ONLY valid JSON matching this schema:
{
  "title": "Application Title",
  "description": "Short system summary",
  "steps": [
    { "agent": "nexa", "message": "Dispatched system specifications for build queue." },
    { "agent": "architect", "message": "Architect Node: Defined schema and component hierarchy." },
    { "agent": "coder", "message": "Core Coder: Generated deterministic React and Tailwind production code." },
    { "agent": "verifier", "message": "Sentinel Node: Verified AST trees, zero syntax errors." }
  ],
  "files": [
    {
      "path": "src/app/page.tsx",
      "content": "// Full Next.js React component here"
    }
  ]
}`;

    // Available free models on Google AI
    const models = ["gemini-3.6-flash", "gemini-3.5-flash-lite"];
    let rawOutput = "";
    let lastErrorMessage = "";

    // Retry loop with delay for handling Google's High Demand spike
    for (const model of models) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        text: `${systemPrompt}\n\nBuild an application for: "${prompt}". Framework: ${framework}`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.2,
                },
              }),
            }
          );

          const json = await res.json();

          if (res.ok && json.candidates?.[0]?.content?.parts?.[0]?.text) {
            rawOutput = json.candidates[0].content.parts[0].text;
            break; // Success! Exit loop
          } else {
            lastErrorMessage = json.error?.message || "Model high demand";
            // Wait 1.5 seconds before retrying the spike
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        } catch (e: any) {
          lastErrorMessage = e.message;
        }
      }

      if (rawOutput) break;
    }

    if (!rawOutput) {
      return NextResponse.json(
        { error: `Google Node busy: ${lastErrorMessage}. Auto-retry scheduled.` },
        { status: 503 }
      );
    }

    let cleaned = rawOutput.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const data = JSON.parse(cleaned);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Nexa Route Exception:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate application source" },
      { status: 500 }
    );
  }
}
