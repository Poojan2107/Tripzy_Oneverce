import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

function createRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

export const redis = createRedis();

export const rateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(parseInt(process.env.RATE_LIMIT_REQUESTS || "20", 10), "10 s"),
      analytics: true,
    })
  : null;
