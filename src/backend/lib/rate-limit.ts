import { rateLimit } from "./redis";

export async function checkRateLimit(req: Request): Promise<boolean> {
  if (!rateLimit) {
    return true;
  }

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const { success } = await rateLimit.limit(ip);
    return success;
  } catch (error) {
    console.warn("Rate limit check failed (Redis outage - failing open):", error);
    return true;
  }
}
