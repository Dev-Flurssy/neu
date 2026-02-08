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
    const hashedPassword = await bcrypt.hash(password, 12);

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

    return NextResponse.json(
      { 
        success: true,
        message: "Account created successfully", 
        data: user 
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
