
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({
        reply: "Zyntarix Backend Alert ⚠️\nGEMINI_API_KEY is not defined in Render Environment."
      });
    }

    const systemInstruction = `You are Zyn, the native conversational co-pilot and system architect of Zyntarix. Default to professional English. Reply in the exact language the user typed in. Never mention third-party company names like Google or OpenAI.`;

    // Direct official models
    const MODELS = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
    let reply = "";
    let lastError = "";

    for (const model of MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: `${systemInstruction}\n\nUser Question: ${message}` }
                  ]
                }
              ]
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          reply = data.candidates[0].content.parts[0].text;
          break;
        } else {
          lastError = data.error?.message || JSON.stringify(data);
          console.warn(`Node ${model} rejected:`, lastError);
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!reply) {
      reply = `Zyntarix Backend Alert ⚠️\nFailed on all nodes. Google upstream error:\n\n"${lastError}"`;
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({
      reply: `System Fatal Error: ${error.message}`,
    });
  }
}
