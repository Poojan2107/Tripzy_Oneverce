import { NextResponse } from "next/server";
import { db } from "../../../backend/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let ready = true;
  const checks: Record<string, "pass" | "fail"> = {};

  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = "pass";
  } catch {
    checks.database = "fail";
    ready = false;
  }

  return NextResponse.json(
    { ready, timestamp: new Date().toISOString(), checks },
    { status: ready ? 200 : 503 }
  );
}
