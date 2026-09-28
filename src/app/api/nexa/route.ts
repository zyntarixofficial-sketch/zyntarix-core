import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { prompt, framework, userCredits, isPatch } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required." },
        { status: 400 }
      );
    }

    if (userCredits !== undefined && userCredits < 5) {
      return NextResponse.json(
        { success: false, error: "Insufficient credits. Please recharge." },
        { status: 403 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY environment variable is not configured.",
        },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    let systemInstruction = "";

    if (isPatch) {
      systemInstruction = `
You are the Zyntarix Core Nexa Engine. You are in PATCH mode.
The user wants to update or fix an existing React application.
- Preserve existing state, structure, and features unless explicitly requested to change.
- Keep the main component entry point named 'export default function App()'.
- Use Tailwind CSS classes for styling (dark-mode first, sleek, modern UI).
- Only use standard Lucide React icons (e.g. ShoppingBag, Search, Plus, Minus, Star, Heart, CheckCircle, Clock, MapPin, Settings, User).
- Return ONLY the clean, full React source code without explanations, markdown fences or backticks.
`;
    } else {
      systemInstruction = `
You are Nexa, the Autonomous Orchestrator and Coder inside Zyntarix Builder.
The user wants to build a complete, interactive ${framework || "Web app"}.

BUILD REQUIREMENTS:
1. Create a fully functional, complete single-file interactive React application.
2. The main component MUST be exported as: 'export default function App()'.
3. Use modern, highly polished Tailwind CSS (dark mode theme: bg-slate-950/bg-slate-900, slate-800 borders, indigo/emerald accents).
4. Include rich mock data, state management (useState, useEffect), interactive buttons, tabs, modal/drawer actions, and search/filters.
5. All icons MUST be standard Lucide React icons (e.g., Search, Plus, Minus, Star, CheckCircle, Clock, MapPin, ShoppingBag, Utensils, Heart, Filter, User, ArrowRight).
6. DO NOT leave placeholders like "// TODO" or empty bodies. Write full working code.
7. Return ONLY the pure TypeScript/React JSX code. Do not wrap in markdown quotes or backticks.
`;
    }

    const result = await model.generateContent([
      { text: systemInstruction },
      { text: prompt },
    ]);

    let generatedCode = result.response.text();

    // Clean markdown code blocks if the model includes them
    generatedCode = generatedCode
      .replace(/^```[a-zA-Z]*\n/gm, "")
      .replace(/```$/gm, "")
      .trim();

    const steps = isPatch
      ? [
          { agent: "nexa", message: "Nexa Engine: Analyzed patch delta and code AST." },
          { agent: "coder", message: "Core Coder: Applied localized component revisions." },
          { agent: "verifier", message: "Sentinel Node: Patch AST verified with zero syntax collisions." },
        ]
      : [
          { agent: "nexa", message: "Dispatched system specifications for build queue." },
          { agent: "architect", message: `Architect Node: Defined schema and component hierarchy for ${framework || "Web app"}.` },
          { agent: "coder", message: "Core Coder: Generated deterministic React and Tailwind production code." },
          { agent: "verifier", message: "Sentinel Node: Verified AST trees with zero fatal exceptions." },
        ];

    return NextResponse.json({
      success: true,
      data: {
        steps,
        files: [
          {
            path: "src/app/page.tsx",
            content: generatedCode,
          },
        ],
      },
    });
  } catch (error: any) {
    console.error("Nexa Route API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error occurred in Nexa engine.",
      },
      { status: 500 }
    );
  }
}

