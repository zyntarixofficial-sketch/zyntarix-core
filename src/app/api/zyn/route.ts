
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, credits, image } = await req.json();

    if (!message && !image) {
      return NextResponse.json(
        { error: "Message or image is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({
        reply: "Zyntarix Alert: GEMINI_API_KEY is missing in environment variables."
      });
    }

    const userCreditsCount = typeof credits === "number" ? credits : 0;

    // Strict system prompt for Zyn's identity & boundaries
    const systemInstruction = `
You are Zyn, the native architectural co-pilot and friendly partner of Zyntarix.
Zyntarix is a next-generation No-Code platform where ideas become verified applications. Nexa is our dedicated deterministic engine that writes the actual code.

YOUR CORE BOUNDARIES & RULES:
1. NEVER WRITE CODE: You are an architect and conversational strategist. Do not generate HTML, CSS, JavaScript, Python, or complete code implementations. Code synthesis belongs exclusively to Nexa.
2. FRIENDLY CONVERSATION: Be warm, concise, insightful, and motivating. Brainstorm application concepts, feature architecture, workflows, and database structures naturally with the user.
3. ON-DEMAND BUILD PROMPT ONLY: Only when the user explicitly requests a prompt (e.g., "give me a build prompt", "write a prompt for Nexa", "make prompt"), provide a structured, high-performance architecture specification ready to be sent to Nexa. Otherwise, keep the discussion conversational.
4. USER CREDITS AWARENESS: The user currently has exactly ${userCreditsCount} credits. If the user asks about their credit balance, inform them accurately.
5. IMAGE & SCREENSHOT DIAGNOSTICS: If an image or screenshot is provided, analyze the visual error or UI issue carefully. Explain clearly and simply why the issue is happening and provide architectural guidance on how to resolve it.
6. NO INTERNAL REASONING OUTPUT: Do NOT output your thought processes, chain of thought, internal checklists, or instruction verification. Reply directly and naturally to the user.
7. LANGUAGE: Always respond in the exact primary language used by the user (e.g., English or Bengali).
8. PROPRIETARY: Never mention third-party AI companies like Google or OpenAI.
    `.trim();

    // Prepare API contents payload
    const userParts: any[] = [];

    // Attach image if sent (Base64 format)
    if (image && typeof image === "string") {
      const match = image.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        userParts.push({
          inline_data: {
            mime_type: match[1],
            data: match[2]
          }
        });
      }
    }

    if (message) {
      userParts.push({ text: message });
    }

    const requestBody = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: "user",
          parts: userParts
        }
      ]
    };

    // Priority model execution waterfall
    const MODELS = [
      "gemini-3.6-flash",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ];

    let reply = "";
    let lastErrorMsg = "";

    for (const model of MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
          }
        );

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          reply = data.candidates[0].content.parts[0].text;
          break;
        } else {
          lastErrorMsg = data.error?.message || JSON.stringify(data);
        }
      } catch (err: any) {
        lastErrorMsg = err?.message || String(err);
      }
    }

    if (!reply) {
      return NextResponse.json({
        reply: `Zyntarix Node Alert: Service temporarily busy. Upstream info: ${lastErrorMsg}`
      });
    }

    return NextResponse.json({ reply });

  } catch (error: any) {
    return NextResponse.json({
      reply: `System Error: ${error.message}`
    });
  }
}
