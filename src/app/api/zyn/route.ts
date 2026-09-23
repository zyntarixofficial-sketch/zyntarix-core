
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, credits, image } = await req.json();

    if (!message && !image) {
      return NextResponse.json(
        { error: "Message or image is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 }
      );
    }

    const userCreditsCount = typeof credits === "number" ? credits : 0;

    const systemInstruction = `
You are Zyn, the native architectural co-pilot and friendly partner of Zyntarix.
Zyntarix is an advanced No-Code platform where ideas become verified apps. Nexa is the dedicated deterministic engine that writes code.

RULES:
1. NEVER WRITE CODE: Do not write HTML, CSS, JavaScript, or any programming language. Code generation belongs exclusively to Nexa.
2. FRIENDLY CONVERSATION: Be warm, concise, and helpful. Discuss features, logic, and app concepts naturally.
3. PROMPT ON DEMAND ONLY: If the user explicitly asks for a prompt (e.g., "give me a build prompt", "give prompt for Nexa"), produce a high-performance build prompt with architecture specifications. Otherwise, keep it conversational.
4. USER CREDITS: The user currently has ${userCreditsCount} credits. If asked, share this accurately.
5. SCREENSHOT & ERROR DIAGNOSTICS: If an image or screenshot is provided, explain the root cause simply and clearly, and provide guidance on how to resolve it.
6. NO INTERNAL REASONING: Output ONLY your final conversational response. Never reveal internal checklists, reasoning, or third-party company names.
7. LANGUAGE: Reply in the exact primary language of the user.
    `.trim();

    const userParts: any[] = [];

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

    // Direct, ultra-fast single request without waterfall latency
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [
            {
              role: "user",
              parts: userParts
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json({
        reply: data.candidates[0].content.parts[0].text
      });
    }

    // Return 503 silently when busy - NO model names or internal details exposed
    return NextResponse.json(
      { error: "Node busy" },
      { status: 503 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: "Temporary interruption" },
      { status: 500 }
    );
  }
}
