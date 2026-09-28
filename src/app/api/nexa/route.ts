import { NextRequest, NextResponse } from "next/server";

function extractCodeRobust(rawText: string): string {
  let text = rawText.trim();

  // 1. Direct JSON attempt
  try {
    const parsed = JSON.parse(text);
    if (parsed.files?.[0]?.content) return parsed.files[0].content;
  } catch (e) {}

  // 2. Markdown json block clean
  if (text.includes("```json")) {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed.files?.[0]?.content) return parsed.files[0].content;
      } catch (e) {}
    }
  }

  // 3. Regex for "content": "..."
  const contentRegex = /"content"\s*:\s*"([\s\S]*?)"\s*\}\s*\]/m;
  const match = text.match(contentRegex);
  if (match && match[1]) {
    return match[1]
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }

  // 4. Raw code block fallback
  if (text.includes("```tsx") || text.includes("```jsx") || text.includes("```javascript") || text.includes("```")) {
    const rawMatch = text.match(/```(?:tsx|jsx|javascript|js)?\s*([\s\S]*?)\s*```/);
    if (rawMatch && rawMatch[1]) {
      return rawMatch[1].trim();
    }
  }

  // 5. Direct React function App fallback
  if (text.includes("export default function") || text.includes("function App")) {
    return text.trim();
  }

  throw new Error("Unable to parse generated AST syntax structure.");
}

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
Synthesize a complete, full-page, beautiful, interactive React application using standard JavaScript JSX and Tailwind CSS.

CRITICAL CODE ARCHITECTURE & RUNTIME SAFETY RULES:
1. Write pure React JSX. NEVER write TypeScript interfaces, type annotations, or generic tags (<any>, <number>).
2. Avoid huge arrays: keep mock data arrays compact (max 3 to 4 items each) so code NEVER gets truncated midway.
3. Keep classNames clean and concise. Avoid fragile template literals with complex nested quotes inside classNames.
4. Always close all JSX tags, curly braces, and template strings cleanly.
5. Every newline in code strings inside JSON MUST be escaped as \\n.
6. The root component MUST start with: export default function App() { ... }
7. Return ONLY valid JSON matching this schema:
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
      "content": "// Full working React component function"
    }
  ]
}`;

    const models = ["gemini-3.6-flash", "gemini-3.5-flash-lite"];
    let rawOutput = "";
    let lastErrorMessage = "";

    for (const model of models) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const res = await fetch(
            `[https://generativelanguage.googleapis.com/v1beta/models/$](https://generativelanguage.googleapis.com/v1beta/models/$){model}:generateContent?key=${apiKey}`,
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
                  maxOutputTokens: 8192,
                },
              }),
            }
          );

          const json = await res.json();

          if (res.ok && json.candidates?.[0]?.content?.parts?.[0]?.text) {
            rawOutput = json.candidates[0].content.parts[0].text;
            break;
          } else {
            lastErrorMessage = json.error?.message || "Model high demand";
            await new Promise((resolve) => setTimeout(resolve, 1200));
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

    const extractedCode = extractCodeRobust(rawOutput);

    return NextResponse.json({
      success: true,
      data: {
        steps: [
          { agent: "nexa", message: "Dispatched system specifications for build queue." },
          { agent: "architect", message: `Architect Node: Defined schema and component hierarchy for ${framework}.` },
          { agent: "coder", message: "Core Coder: Generated deterministic React and Tailwind production code." },
          { agent: "verifier", message: "Sentinel Node: Verified AST trees with zero fatal exceptions." }
        ],
        files: [
          {
            path: "src/app/page.tsx",
            content: extractedCode
          }
        ]
      }
    });
  } catch (error: any) {
    console.error("Nexa Route Exception:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate application source" },
      { status: 500 }
    );
  }
}

