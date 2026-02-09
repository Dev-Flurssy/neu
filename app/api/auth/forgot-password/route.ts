import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, generatePasswordResetEmail, generateCode } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists or not for security
    if (!user) {
      return NextResponse.json({
        message: "If an account exists, a reset code has been sent",
      });
    }

    // Generate reset code
    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old codes
    await prisma.verificationCode.deleteMany({
      where: {
        email,
        type: "password_reset",
      },
    });

    // Create new code
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        type: "password_reset",
        expires,
      },
    });

    // Send email
    await sendEmail({
      to: email,
      subject: "Reset Your Password - NEU Notes",
      html: generatePasswordResetEmail(code, user.name || undefined),
    });

    return NextResponse.json({
      message: "If an account exists, a reset code has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
