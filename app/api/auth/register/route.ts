import { NextResponse } from "next/server";
import { authSchema } from "@/app/api/auth/authschema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validated = authSchema.safeParse(body);
    if (!validated.success) {
      const firstError = Object.values(validated.error.flatten().fieldErrors).flat()[0];
      return NextResponse.json(
        { error: firstError || "Validation failed" },
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

    // Create user — email is auto-verified, no confirmation step needed
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(
      { 
        success: true,
        message: "Account created successfully.",
        data: user,
        requiresVerification: false,
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
