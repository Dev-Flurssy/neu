import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { noteUpdateSchema } from "@/lib/note";

export async function GET(
  _: Request,
  { params }: { params: { noteid: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const note = await prisma.note.findFirst({
      where: { id: params.noteid, userId: session.user.id },
    });

    if (!note) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: note });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { noteid: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = noteUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const note = await prisma.note.findFirst({
    where: {
      id: params.noteid,
      userId: session.user.id,
    },
  });

  if (!note) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const updated = await prisma.note.update({
    where: { id: note.id },
    data: parsed.data,
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  _: Request,
  { params }: { params: { noteid: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const note = await prisma.note.findFirst({
    where: {
      id: params.noteid,
      userId: session.user.id,
    },
  });

  if (!note) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const deleted = await prisma.note.delete({
    where: { id: note.id },
  });

  return NextResponse.json({ success: true, data: deleted });
}
