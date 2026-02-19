

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
