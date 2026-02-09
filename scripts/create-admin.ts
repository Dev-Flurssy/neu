/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ADMIN CREATION SCRIPT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 📍 LOCATION: neu/scripts/create-admin.ts
 * 
 * 🎯 PURPOSE:
 * Creates a brand new admin user account from scratch with full privileges.
 * Perfect for initial setup or adding new administrators.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 HOW TO USE:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * COMMAND FORMAT:
 * npx tsx scripts/create-admin.ts <email> <password> <name>
 * 
 * EXAMPLE 1 - Create your first admin:
 * npx tsx scripts/create-admin.ts admin@example.com SecurePass123 "Admin User"
 * 
 * EXAMPLE 2 - Create admin with your school email:
 * npx tsx scripts/create-admin.ts 20253807@std.neu.edu.tr MyPassword123 "NEU Admin"
 * 
 * EXAMPLE 3 - Create admin with spaces in name (use quotes):
 * npx tsx scripts/create-admin.ts john@example.com Pass123456 "John Doe"
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ✨ WHAT IT DOES:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ✅ Creates a new user account in the database
 * ✅ Sets role to "admin" (full access to admin panel)
 * ✅ Hashes password securely using bcrypt (10 rounds)
 * ✅ Auto-verifies email address (no verification needed)
 * ✅ Account is ready to use immediately after creation
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 📋 REQUIREMENTS:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ⚠️ Email must be unique (not already registered)
 * ⚠️ Password must be at least 6 characters long
 * ⚠️ Name can include spaces (wrap in quotes if it does)
 * ⚠️ Database must be running and accessible
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔐 ADMIN PRIVILEGES:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Admin users can:
 * • Access admin panel at /admin
 * • View all users and their statistics
 * • Monitor API usage and system stats
 * • Create new admin accounts
 * • Promote users to admin
 * • Demote admins to regular users
 * • Delete user accounts
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚨 TROUBLESHOOTING:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ERROR: "User with this email already exists"
 * → Solution: Use make-admin.ts to promote existing user instead
 * → Command: npx tsx scripts/make-admin.ts existing-email@example.com
 * 
 * ERROR: "Password must be at least 6 characters"
 * → Solution: Use a longer password (minimum 6 characters)
 * 
 * ERROR: "command not found: tsx"
 * → Solution: npx will auto-install tsx, just run the command again
 * 
 * ERROR: Database connection failed
 * → Solution: Make sure your database is running
 * → Check: DATABASE_URL in .env file is correct
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 📚 RELATED SCRIPTS:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * make-admin.ts    - Promote existing user to admin
 * README.md        - Full documentation with examples
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Import from the custom generated location
const { PrismaClient } = require('../app/generated/prisma');
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin(email: string, password: string, name: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error('❌ User with this email already exists');
      console.log('Use the make-admin.ts script to promote existing users');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
        emailVerified: new Date(), // Auto-verify admin accounts
      },
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔑 Role:', admin.role);
    console.log('✓  Email Verified:', admin.emailVerified ? 'Yes' : 'No');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('You can now log in with these credentials.');
  } catch (error: any) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4];

if (!email || !password || !name) {
  console.error('❌ Missing required arguments\n');
  console.log('Usage: npx tsx scripts/create-admin.ts <email> <password> <name>');
  console.log('\nExample:');
  console.log('  npx tsx scripts/create-admin.ts admin@example.com MySecurePass123 "Admin User"\n');
  process.exit(1);
}

// Validate password length
if (password.length < 6) {
  console.error('❌ Password must be at least 6 characters long');
  process.exit(1);
}

createAdmin(email, password, name);
