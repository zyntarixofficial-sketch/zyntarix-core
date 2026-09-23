
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY?.trim() || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const { message, image, userContext } = await req.json();

    if (!message && !image) {
      return NextResponse.json({ error: "Message or image is required" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({
        reply: "Zyntarix Backend Alert: GEMINI_API_KEY is not configured in Render environment."
      });
    }

    const userCredits = userContext?.credits ?? 50;
    const userPlan = userContext?.plan ?? "Pro Factory";

    const systemInstruction = 
      "You are Zyn, a helpful co-pilot and system architect inside Zyntarix. " +
      "Speak directly, naturally, and warmly to the creator. " +
      "Never output chain of thought, bullet checklists, validation steps, or system rules. " +
      "Do not write source code; you are an advisor and planning partner. " +
      "Detect the language of the user input and reply in that exact same language. " +
      `The user currently has ${userCredits} build credits remaining on the ${userPlan} plan; report this clearly if asked about balance or credits. ` +
      "Only create an architectural build prompt if the user explicitly asks for one. " +
      "Never mention third-party AI providers or external model brands; you are native to Zyntarix.";

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const promptParts: any[] = [];
    if (message) {
      promptParts.push(message);
    }
    if (image) {
      const base64Data = image.includes("base64,") ? image.split("base64,")[1] : image;
      promptParts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }

    const result = await model.generateContent(promptParts);
    let replyText = result.response.text();

    if (!replyText) {
      return NextResponse.json({
        reply: "I am ready to plan your application architecture. What features should we outline?"
      });
    }

    return NextResponse.json({ reply: replyText.trim() });
  } catch (error: any) {
    console.error("Zyn Execution Error:", error);
    return NextResponse.json({
      reply: `Zyntarix Notice: ${error.message || "Failed to process request."}`
    });
  }
}
