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
        reply: "Zyntarix Backend Alert ⚠️\nGEMINI_API_KEY is missing in Render Environment variables."
      });
    }

    const systemInstruction = `
      You are Zyn, the native conversational co-pilot and system architect of Zyntarix.
      
      CORE BEHAVIOR:
      1. Default to professional English. If the user greets you (e.g. "Hi", "Hello", "Who are you?"), introduce yourself concisely as Zyn, the architect co-pilot of Zyntarix.
      2. If the user asks for an app idea, features, or says "give me a prompt", generate a high-performance build prompt with architecture specifications so they can send it to Nexa.
      3. Language: Always reply in the EXACT language the user typed in.
      4. Proprietary: NEVER mention third-party company names like Google or OpenAI.
    `;

    // Fetch active models authorized for this API key
    const listResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const listData = await listResponse.json();

    if (!listResponse.ok) {
      return NextResponse.json({
        reply: `Zyntarix Backend Alert ⚠️\nAPI Key Error: ${listData.error?.message || JSON.stringify(listData)}`
      });
    }

    const availableModels: string[] = (listData.models || [])
      .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m: any) => m.name.replace("models/", ""));

    if (availableModels.length === 0) {
      return NextResponse.json({
        reply: "Zyntarix Backend Alert ⚠️\nNo content generation models are active for this API key."
      });
    }

    // Explicitly target gemini-3.6-flash as requested by the API
    const preferredOrder = [
      "gemini-3.6-flash",
      ...availableModels
    ];
    
    const targetModel = preferredOrder.find((m) => availableModels.includes(m)) || "gemini-3.6-flash";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemInstruction}\n\nUser Input:\n${message}`
                }
              ]
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

    return NextResponse.json({
      reply: `Zyntarix Backend Alert ⚠️\nModel [${targetModel}] execution failed: ${data.error?.message || JSON.stringify(data)}`
    });

  } catch (error: any) {
    return NextResponse.json({
      reply: `System Fatal Error: ${error.message}`
    });
  }
}

