import { rateLimit } from "./redis";
import { auth } from "./auth";

export async function checkRateLimit(req: Request): Promise<boolean> {
  if (!rateLimit) {
    return true;
  }

  try {
    const session = await auth();
    const userId = session?.user?.id;
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const identifier = userId || ip;
    const { success } = await rateLimit.limit(identifier);
    return success;
  } catch (error) {
    console.warn("Rate limit check failed (Redis outage - failing open):", error);
    return true;
  }
}
