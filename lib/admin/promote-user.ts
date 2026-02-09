/**
 * User promotion utility functions
 * Used by admin panel to promote users to admin
 */

/*If you already signed up:
npx tsx scripts/make-admin.ts your-email@example.com
 */

import { prisma } from "@/lib/prisma";

export interface PromoteUserResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string | null;
    name: string | null;
    role: string;
  };
}

/**
 * Promote an existing user to admin
 */
export async function promoteUserToAdmin(
  email: string
): Promise<PromoteUserResult> {
  try {
    if (!email) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    // Find and update user
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return {
      success: true,
      message: "User promoted to admin successfully",
      user,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        success: false,
        message: "User not found with this email",
      };
    }

    console.error("Error promoting user:", error);
    return {
      success: false,
      message: error.message || "Failed to promote user",
    };
  }
}

/**
 * Demote an admin to regular user
 */
export async function demoteAdminToUser(
  email: string
): Promise<PromoteUserResult> {
  try {
    if (!email) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    // Find and update user
    const user = await prisma.user.update({
      where: { email },
      data: { role: "user" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return {
      success: true,
      message: "Admin demoted to user successfully",
      user,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        success: false,
        message: "User not found with this email",
      };
    }

    console.error("Error demoting admin:", error);
    return {
      success: false,
      message: error.message || "Failed to demote admin",
    };
  }
}
