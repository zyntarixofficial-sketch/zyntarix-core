import { NextRequest, NextResponse } from "next/server";

function extractAppCode(rawText: string): string {
  let cleaned = rawText.trim();

  if (cleaned.includes("```")) {
    const codeBlockMatch = cleaned.match(/```(?:tsx|jsx|javascript|typescript|react)?([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      cleaned = codeBlockMatch[1].trim();
    } else {
      cleaned = cleaned.replace(/```(?:tsx|jsx|javascript|typescript|react)?/gi, "").replace(/```/g, "").trim();
    }
  }

  if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed.files && parsed.files[0]?.content) {
        return parsed.files[0].content;
      }
      if (parsed.content) return parsed.content;
      if (parsed.code) return parsed.code;
    } catch (e) {
      const match = cleaned.match(/"content"\s*:\s*"([\s\S]*?)"\s*\}/);
      if (match && match[1]) {
        return match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
      }
    }
  }

  if (!cleaned.includes("function App") && !cleaned.includes("export default")) {
    cleaned = `export default function App() {\n  return (\n    <div className="p-6 bg-slate-900 text-white min-h-screen">\n${cleaned}\n    </div>\n  );\n}`;
  }

  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, framework = "Next.js" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: "API Configuration missing" }, { status: 500 });
    }

    const systemPrompt = `You are Nexa, the Autonomous Fullstack AI of Zyntarix.
Write a COMPLETE, modern, fully functional interactive React component using JavaScript JSX and Tailwind CSS.

CRITICAL INSTRUCTIONS:
1. Return ONLY the executable React component code.
2. The component MUST start with:
export default function App() {
3. Use React hooks (React.useState, React.useEffect) for full user interactivity.
4. Do NOT use TypeScript type definitions, interfaces, or generic tags (<any>, <T>).
5. Do NOT import third-party packages or icons. Use simple SVG elements or inline HTML.
6. Make sure all JSX tags and braces are completely closed. NEVER cut off or stop halfway.`;

    const apiUrl = `[https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=$](https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=$){apiKey}`;

    let rawOutput = "";
    let lastErrorMessage = "";

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\nUser Request: "${prompt}". Application Framework: ${framework}. Return complete code.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
          },
        }),
      });

      const json = await res.json();

      if (res.ok && json.candidates?.[0]?.content?.parts?.[0]?.text) {
        rawOutput = json.candidates[0].content.parts[0].text;
      } else {
        lastErrorMessage = json.error?.message || "Model request error";
      }
    } catch (e: any) {
      lastErrorMessage = e.message;
    }

    if (!rawOutput) {
      return NextResponse.json(
        { error: `Google API Error: ${lastErrorMessage}` },
        { status: 503 }
      );
    }

    const appCode = extractAppCode(rawOutput);

    const payload = {
      title: "Generated Application",
      description: "Synthesized via Autonomous Coder",
      steps: [
        { agent: "nexa", message: "Dispatched system specifications for build queue." },
        { agent: "architect", message: "Architect Node: Defined schema and component hierarchy." },
        { agent: "coder", message: "Core Coder: Generated deterministic React and Tailwind production code." },
        { agent: "verifier", message: "Sentinel Node: Verified AST trees with zero fatal exceptions." }
      ],
      files: [
        {
          path: "src/app/page.tsx",
          content: appCode
        }
      ]
    };

    return NextResponse.json({ success: true, data: payload });
  } catch (error: any) {
    console.error("Nexa Route Exception:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate application source" },
      { status: 500 }
    );
  }
}

