#!/usr/bin/env node
// Seeds local SQLite database with admin users (no Google sign-in needed).
// Usage: node scripts/seed-admin-local.mjs me@email.com cofounder@email.com

import { PrismaClient } from '@prisma/client';

const emails = process.argv.slice(2);
if (emails.length === 0) {
  console.error('Usage: node scripts/seed-admin-local.mjs <email> [email2 ...]');
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  for (const email of emails) {
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN" },
      create: {
        email,
        name: email.split('@')[0],
        role: "ADMIN",
      },
    });
    console.log(`Admin: ${user.email} (role: ${user.role})`);
  }
  console.log('Done. Sign in with Google using the same email — NextAuth will link your account and grant admin access.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
