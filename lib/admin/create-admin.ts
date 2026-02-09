/**
 * Admin creation utility functions
 * Used by admin panel to create new admin users
*/

/* In your neu folder, run:
npx tsx scripts/create-admin.ts your-email@example.com YourPassword123 "Your Name"

# Example with your school email:
npx tsx scripts/create-admin.ts 20253807@std.neu.edu.tr SecurePass123 "NEU Admin"
*/

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export interface CreateAdminInput {
  email: string;
  password: string;
  name: string;
}

export interface CreateAdminResult {
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
 * Create a new admin user
 */
export async function createAdmin(
  input: CreateAdminInput
): Promise<CreateAdminResult> {
  try {
    // Validate input
    if (!input.email || !input.password || !input.name) {
      return {
        success: false,
        message: "Email, password, and name are required",
      };
    }

    if (input.password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: hashedPassword,
        role: "admin",
        emailVerified: new Date(), // Auto-verify admin accounts
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return {
      success: true,
      message: "Admin user created successfully",
      user: admin,
    };
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return {
      success: false,
      message: error.message || "Failed to create admin user",
    };
  }
}
