import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promoteUserToAdmin } from "@/lib/admin";

/**
 * POST /api/admin/promote
 * Promote an existing user to admin (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { prisma } = await import("@/lib/prisma");
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (currentUser?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body
    const body = await req.json();
    const { email } = body;

    // Promote user to admin
    const result = await promoteUserToAdmin(email);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: result.message,
      user: result.user,
    });
  } catch (error: any) {
    console.error("Promote to admin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
