import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const generateAI = new GoogleGenerativeAI(apiKey);

const geminiModel = generateAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

export async function POST(request: NextRequest) {
  try {
    const { prompt }: { prompt?: string } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "prompt is required" },
        { status: 400 }
      );
    }

    const result = await geminiModel.generateContent(`
      Generate a clean Markdown note based on this topic:
      ${prompt}

      Use headings, bullet points, and short explanations.
    `);

    const text = result.response?.text() ?? "No content generated.";
    return NextResponse.json({ data: text });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { message: "AI generation failed" },
      { status: 500 }
    );
  }
}
