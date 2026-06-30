import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const getPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.warn("[tripzy/db] DATABASE_URL is not set. Prisma client may fail to connect.");
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const db = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
