import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateVerificationEmail, generateCode } from "@/lib/email";

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

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // Generate verification code
    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old codes
    await prisma.verificationCode.deleteMany({
      where: {
        email,
        type: "email_verification",
      },
    });

    // Create new code
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        type: "email_verification",
        expires,
      },
    });

    // Send email (skip in dev if EMAIL_ENABLED is false)
    const shouldSendEmail = process.env.NODE_ENV === "production" || process.env.EMAIL_ENABLED === "true";
    
    if (shouldSendEmail) {
      await sendEmail({
        to: email,
        subject: "Verify Your Email - NEU Notes",
        html: generateVerificationEmail(code, user.name || undefined),
      });
    } else {
      console.log("📧 Email sending disabled in development");
    }

    // In development, log the verification code
    if (process.env.NODE_ENV === "development") {
      console.log("\n=================================");
      console.log("📧 VERIFICATION CODE (DEV MODE)");
      console.log("=================================");
      console.log(`Email: ${email}`);
      console.log(`Code: ${code}`);
      console.log("=================================\n");
    }

    return NextResponse.json({
      message: "Verification code sent to your email",
      // Include code in dev mode for easy testing
      ...(process.env.NODE_ENV === "development" && { devCode: code })
    });
  } catch (error) {
    console.error("Send verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
