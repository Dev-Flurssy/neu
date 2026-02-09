/**
 * ═══════════════════════════════════════════════════════════════════════════
 * USER PROMOTION SCRIPT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 📍 LOCATION: neu/scripts/make-admin.ts
 * 
 * 🎯 PURPOSE:
 * Promotes an existing user account to admin role.
 * Use this when you already have a registered user who needs admin access.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 HOW TO USE:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * COMMAND FORMAT:
 * npx tsx scripts/make-admin.ts <email>
 * 
 * EXAMPLE 1 - Promote yourself to admin:
 * npx tsx scripts/make-admin.ts your-email@example.com
 * 
 * EXAMPLE 2 - Promote a school email:
 * npx tsx scripts/make-admin.ts 20253807@std.neu.edu.tr
 * 
 * EXAMPLE 3 - Promote any registered user:
 * npx tsx scripts/make-admin.ts john.doe@company.com
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ WHAT IT DOES:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ✅ Finds existing user by email address
 * ✅ Changes their role from "user" to "admin"
 * ✅ Grants immediate access to admin panel
 * ✅ User keeps all their existing notes and data
 * ✅ No password change required
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 📋 REQUIREMENTS:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ⚠️ User must already exist in the database
 * ⚠️ User must have registered through signup
 * ⚠️ Email must match exactly (case-sensitive)
 * ⚠️ Database must be running and accessible
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔐 ADMIN PRIVILEGES GRANTED:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * After promotion, user can:
 * • Access admin panel at /admin
 * • View all users and their statistics
 * • Monitor API usage and system stats
 * • Create new admin accounts
 * • Promote other users to admin
 * • Demote admins to regular users
 * • Delete user accounts
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚨 TROUBLESHOOTING:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ERROR: "User not found with email: xxx"
 * → Solution: User hasn't registered yet
 * → Action: Either have them sign up first, or use create-admin.ts
 * → Command: npx tsx scripts/create-admin.ts email password "Name"
 * 
 * ERROR: "command not found: tsx"
 * → Solution: npx will auto-install tsx, just run the command again
 * 
 * ERROR: Database connection failed
 * → Solution: Make sure your database is running
 * → Check: DATABASE_URL in .env file is correct
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔄 TO DEMOTE AN ADMIN:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Option 1 - Use Prisma Studio:
 * 1. Run: npx prisma studio
 * 2. Open User table
 * 3. Find the user
 * 4. Change role from "admin" to "user"
 * 5. Save changes
 * 
 * Option 2 - Use Admin Panel:
 * 1. Log in as admin
 * 2. Go to /admin
 * 3. Click Users tab
 * 4. Click "Remove Admin" button next to user
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 📚 RELATED SCRIPTS:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * create-admin.ts  - Create new admin from scratch
 * README.md        - Full documentation with examples
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
    });

    console.log('✅ User promoted to admin successfully!');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Role:', user.role);
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.error('❌ User not found with email:', email);
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: npx tsx scripts/make-admin.ts <email>');
  process.exit(1);
}

makeAdmin(email);
