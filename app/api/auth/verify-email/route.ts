import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // Find verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        type: "email_verification",
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verificationCode) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    // Update user
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete used code
    await prisma.verificationCode.delete({
      where: { id: verificationCode.id },
    });

    return NextResponse.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
