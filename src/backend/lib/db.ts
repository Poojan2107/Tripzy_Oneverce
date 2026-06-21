import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const getPrismaClient = () => {
  if (process.env.VERCEL === "1") {
    const dbName = "dev.db";
    const srcPath = path.join(process.cwd(), "prisma", dbName);
    const destPath = path.join("/tmp", dbName);

    try {
      if (!fs.existsSync(destPath)) {
        console.log(`Copying database from ${srcPath} to ${destPath}`);
        // Ensure /tmp directory exists (should always exist on Vercel)
        const tmpDir = path.dirname(destPath);
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        fs.copyFileSync(srcPath, destPath);
        console.log("Database copied successfully!");
      } else {
        console.log("Database already exists in /tmp");
      }
    } catch (error) {
      console.error("Error setting up SQLite in /tmp:", error);
    }

    return new PrismaClient({
      datasources: {
        db: {
          url: `file:${destPath}`,
        },
      },
    });
  }
  return new PrismaClient();
};

export const db = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
