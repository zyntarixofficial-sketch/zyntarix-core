
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, framework = "Next.js", userCredits = 50 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (userCredits < 5) {
      return NextResponse.json(
        { error: "Insufficient credits. Please recharge your balance to build." },
        { status: 402 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: "API Configuration missing" }, { status: 500 });
    }

    const systemInstruction = `
You are Nexa, the Master Deterministic Orchestration Engine of Zyntarix platform.
You convert software architecture blueprints into complete, verified, production-ready code.

RULES:
1. ZERO INCOMPLETE CODE: Never output placeholders, "// write logic here", or half-finished files. Write fully functional TypeScript, React, and Tailwind CSS code.
2. SUB-AGENT ORCHESTRATION: Generate live terminal milestone messages for the 4 nodes:
   - Nexa Dispatcher
   - Zyntarix Architect Node
   - Zyntarix Core Coder
   - Sentinel Verification Node (Auto-checks syntax and imports)
3. TARGET FRAMEWORK: ${framework}
4. NO CASUAL CHAT: Output ONLY valid JSON matching this schema:
{
  "title": "Application Name",
  "description": "Short system summary",
  "creditsUsed": 5,
  "steps": [
    { "agent": "nexa", "message": "Dispatched system specifications for build queue." },
    { "agent": "architect", "message": "Architect Node: Defined state machines, schema, and layout hierarchy." },
    { "agent": "coder", "message": "Core Coder: Generated deterministic React and Tailwind production code." },
    { "agent": "verifier", "message": "Sentinel Node: Verified AST trees, zero syntax errors, dependencies resolved." }
  ],
  "files": [
    {
      "path": "src/app/page.tsx",
      "content": "// Full working Next.js component..."
    }
  ]
}
Do NOT mention any external 3rd-party company names.
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
              parts: [{ text: `Generate full application for prompt: "${prompt}"` }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const parsedData = JSON.parse(data.candidates[0].content.parts[0].text);
      return NextResponse.json({ success: true, data: parsedData });
    }

    return NextResponse.json({ error: "Nexa node temporarily busy" }, { status: 503 });
  } catch (error: any) {
    console.error("Nexa Engine Failure:", error);
    return NextResponse.json(
      { error: error.message || "Pipeline execution failed" },
      { status: 500 }
    );
  }
}
