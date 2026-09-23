
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({
        reply: "System notice: GEMINI_API_KEY is not configured in Render environment.",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
        You are Zyn, the native architectural and planning co-pilot inside Zyntarix.
        Respond naturally and intelligently in the EXACT language used by the user.
        If the user writes in English, reply in English.
        If the user writes in Bengali (Bangla/Banglish), reply in natural Bengali.
        Keep replies conversational, concise, and helpful for designing web and mobile apps.
        Never disclose or mention third-party AI brands or foundation model names.
      `,
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Zyn Engine Error:", error);
    return NextResponse.json(
      { reply: `Zyn Error: ${error.message || "Failed to connect to model"}` },
      { status: 200 }
    );
  }
}
