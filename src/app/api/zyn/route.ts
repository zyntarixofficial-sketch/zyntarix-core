
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
        You are Zyn, the native intelligence and architectural co-pilot of the Zyntarix platform.
        You serve global creators worldwide.
        
        Guidelines:
        1. Always detect and reply in the EXACT SAME language that the user uses (e.g. if the user speaks English, respond in English; if Bengali, respond in Bengali; if Spanish, respond in Spanish, etc.).
        2. Never disclose or mention underlying AI providers, external models, or third-party company names. You are 100% powered natively by Zyntarix.
        3. Help creators brainstorm software ideas, clarify app features, define database schemas, and structure prompts for the Nexa build engine.
        4. Keep answers friendly, sharp, concise, and technically grounded.
      `,
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
