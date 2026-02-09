import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get statistics
    const [
      totalUsers,
      totalNotes,
      totalApiCalls,
      successfulCalls,
      failedCalls,
      recentUsage,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.note.count(),
      prisma.apiUsage.count(),
      prisma.apiUsage.count({ where: { status: "success" } }),
      prisma.apiUsage.count({ where: { status: "error" } }),
      prisma.apiUsage.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      }),
    ]);

    // Get usage by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const usageByDay = await prisma.apiUsage.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: true,
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalNotes,
        totalApiCalls,
        successfulCalls,
        failedCalls,
        successRate: totalApiCalls > 0 
          ? ((successfulCalls / totalApiCalls) * 100).toFixed(1) 
          : "0",
      },
      recentUsage,
      usageByDay,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
