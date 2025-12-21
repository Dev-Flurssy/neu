import { NextResponse } from "next/server";
import { authSchema } from "../authschema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();

  const validated = authSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: validated.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password, name } = validated.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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
    { message: "Account created successfully", user },
    { status: 201 }
  );
}
