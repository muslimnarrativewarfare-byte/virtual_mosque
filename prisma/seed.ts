import { Role } from '@prisma/client';
import { hash } from 'bcryptjs';

import { prisma } from '../lib/prisma';

async function main() {
  const adminPasswordHash = await hash(
    process.env.SEED_PLATFORM_ADMIN_PASSWORD ?? 'ChangeMePlatformAdmin123!',
    12,
  );
  const mosqueManagerPasswordHash = await hash(
    process.env.SEED_MOSQUE_ADMIN_PASSWORD ?? 'ChangeMeMosqueAdmin123!',
    12,
  );

  await prisma.user.upsert({
    where: { email: process.env.SEED_PLATFORM_ADMIN_EMAIL ?? 'admin@virtualmosque.com' },
    update: {
      name: 'Platform Admin',
      role: Role.PLATFORM_ADMIN,
      passwordHash: adminPasswordHash,
    },
    create: {
      name: 'Platform Admin',
      email: process.env.SEED_PLATFORM_ADMIN_EMAIL ?? 'admin@virtualmosque.com',
      role: Role.PLATFORM_ADMIN,
      passwordHash: adminPasswordHash,
    },
  });

  await prisma.user.upsert({
    where: {
      email:
        process.env.SEED_MOSQUE_ADMIN_EMAIL ??
        'manager@virtualmosque.com',
    },
    update: {
      name: 'Mosque Manager',
      role: Role.MOSQUE_ADMIN,
      passwordHash: mosqueManagerPasswordHash,
    },
    create: {
      name: 'Mosque Manager',
      email:
        process.env.SEED_MOSQUE_ADMIN_EMAIL ??
        'manager@virtualmosque.com',
      role: Role.MOSQUE_ADMIN,
      passwordHash: mosqueManagerPasswordHash,
    },
  });
}

main()
  .catch(async (error) => {
    console.error('Seeding failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
