

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
