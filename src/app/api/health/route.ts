import { NextResponse } from "next/server";
import { db } from "../../../backend/lib/db";
import { checkEnv } from "../../../backend/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const missing = checkEnv();
  const envOk = missing.length === 0;

  let dbOk = false;
  let dbError: string | null = null;
  try {
    await db.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e: any) {
    dbError = e?.message || "Database unreachable";
  }

  const status = envOk && dbOk ? 200 : 503;

  return NextResponse.json(
    {
      status: status === 200 ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      checks: {
        environment: envOk ? "pass" : "fail",
        database: dbOk ? "pass" : "fail",
      },
      ...(dbError ? { details: { database: dbError } } : {}),
      ...(!envOk ? { details: { missingEnv: missing } } : {}),
    },
    { status }
  );
}
