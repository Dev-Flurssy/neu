import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an academic assistant that generates complete, ready-to-use lecture notes in Markdown format. Generate full notes with comprehensive content based on the requested page count. Output ONLY valid Markdown without any commentary or meta-text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 4000,
    });

    // Track API usage
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        await prisma.apiUsage.create({
          data: {
            userId: user.id,
            endpoint: "/api/ai/generate",
            status: "success",
          },
        });
      }
    }

    return NextResponse.json({
      text: completion.choices[0]?.message?.content ?? "",
    });
  } catch (error) {
    console.error("Groq error:", error);

    // Track failed usage
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        await prisma.apiUsage.create({
          data: {
            userId: user.id,
            endpoint: "/api/ai/generate",
            status: "error",
          },
        });
      }
    }

    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 },
    );
  }
}
