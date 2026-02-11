import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma Client instance.
 * In development, attach to globalThis to prevent multiple instances
 * caused by Next.js hot-reloading.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
