import { NextResponse } from "next/server";
import { authSchema } from "@/app/api/auth/authschema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendEmail, generateVerificationEmail, generateCode } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validated = authSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          errors: validated.error.flatten().fieldErrors 
        },
        { status: 400 },
      );
    }

    const { email, password, name } = validated.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // Hash password with higher cost factor for better security
    // Use lower cost in development for faster registration
    const saltRounds = process.env.NODE_ENV === "development" ? 10 : 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Generate verification code
    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create verification code
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        type: "email_verification",
        expires,
      },
    });

    // Send verification email (skip in dev if EMAIL_ENABLED is false)
    const shouldSendEmail = process.env.NODE_ENV === "production" || process.env.EMAIL_ENABLED === "true";
    
    if (shouldSendEmail) {
      try {
        await sendEmail({
          to: email,
          subject: "Verify Your Email - NEU Notes",
          html: generateVerificationEmail(code, name || undefined),
        });
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        // Don't fail registration if email fails, user can request resend
      }
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

    return NextResponse.json(
      { 
        success: true,
        message: "Account created successfully. Please check your email for verification code.", 
        data: user,
        requiresVerification: true,
        // Include code in dev mode for easy testing
        ...(process.env.NODE_ENV === "development" && { devCode: code })
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Registration error:", err);
    
    // Handle specific Prisma errors
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 },
    );
  }
}
