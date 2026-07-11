import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: any };

const getPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.warn("[tripzy/db] DATABASE_URL is not set. Prisma client may fail to connect.");
  }
  
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  // Apply auto-retry extension for connection drops
  return client.$extends({
    query: {
      async $allOperations({ model, operation, args, query }) {
        let retries = 3;
        let delayMs = 500;
        let lastError: any;
        for (let attempt = 0; attempt < retries; attempt++) {
          try {
            return await query(args);
          } catch (error: any) {
            lastError = error;
            const errorMessage = error?.message || "";
            const isConnectionError = 
              errorMessage.toLowerCase().includes("connection") || 
              errorMessage.toLowerCase().includes("connect") ||
              errorMessage.toLowerCase().includes("lost") ||
              errorMessage.toLowerCase().includes("reach database") ||
              errorMessage.toLowerCase().includes("closed") ||
              errorMessage.toLowerCase().includes("timeout") ||
              error?.code?.startsWith("P1") ||
              error?.code?.startsWith("P20");

            if (isConnectionError && attempt < retries - 1) {
              console.warn(`[prisma-retry] Query failed (attempt ${attempt + 1}/${retries}) due to connection issue. Retrying in ${delayMs * (attempt + 1)}ms...`);
              await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
              continue;
            }
            throw error;
          }
        }
        throw lastError;
      }
    }
  });
};

export const db = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
