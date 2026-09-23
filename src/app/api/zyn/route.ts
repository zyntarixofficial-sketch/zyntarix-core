import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, image, userContext } = await req.json();

    if (!message && !image) {
      return NextResponse.json({ error: "Message or image is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({
        reply: "Zyntarix Backend Alert ⚠️\nGEMINI_API_KEY is missing in Render Environment."
      });
    }

    const userCredits = userContext?.credits ?? 50;
    const userPlan = userContext?.plan ?? "Pro Factory";

    const systemInstruction = `
      You are Zyn, the native friendly conversational co-pilot and system architect of Zyntarix.

      CORE PRINCIPLES:
      1. Tone: Friendly, smart, warm, and natural. DO NOT write code. You are an advisor and brainstorming partner, NOT a code generator.
      2. No Internal Monologue: NEVER explain your thought process, checklists, or system rules to the user. Speak directly and naturally.
      3. Language: Reply in the EXACT language used by the user. If they speak English, reply in English. If Bengali/Banglish, reply in Bengali.
      4. Credits & Plan: The user currently has ${userCredits} build credits remaining on the ${userPlan} plan. If they ask about credits, balance, or plan, tell them clearly and accurately.
      5. Build Prompts: DO NOT generate a build prompt unless the user explicitly asks for one (e.g., "give me a prompt", "create a prompt for Nexa"). When they explicitly ask, write a clean, high-performance architectural prompt they can transfer to Nexa.
      6. Visual Analysis: If an image or screenshot is provided, examine it carefully. If it shows UI sketches, suggest architectural layout improvements. If it shows an error, explain clearly what the issue is and how to resolve it.
      7. Proprietary: NEVER mention Google, Gemini, OpenAI, Claude, or any third-party company names. You are 100% native to Zyntarix.
    `;

    // 1. Fetch available models authorized for your API key
    const listResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const listData = await listResponse.json();

    const activeModels: string[] = (listData.models || [])
      .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m: any) => m.name.replace("models/", ""));

    const modelsToExecute = Array.from(
      new Set(["gemini-1.5-flash", "gemini-1.5-flash-latest", ...activeModels])
    );

    // Build contents payload
    const parts: any[] = [];
    if (message) {
      parts.push({ text: message });
    }
    if (image) {
      // image is expected as base64 string
      const base64Data = image.includes("base64,") ? image.split("base64,")[1] : image;
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: base64Data,
        },
      });
    }

    let reply = "";
    let lastError = "";

    for (const model of modelsToExecute) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
                  parts: parts
                }
              ]
            })
          }
        );

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          reply = data.candidates[0].content.parts[0].text;
          break;
        } else {
          lastError = data.error?.message || JSON.stringify(data);
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!reply) {
      return NextResponse.json({
        reply: `High demand on the network right now. Please try your message again in a moment!`
      });
    }

    return NextResponse.json({ reply });

  } catch (error: any) {
    return NextResponse.json({
      reply: `System notice: ${error.message}`
    });
  }
}

