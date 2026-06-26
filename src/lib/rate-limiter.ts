import { redis } from './server/redis';
import { SECURITY } from '@/config/constants';
import { TooManyRequestsError } from './errors';

export interface RateLimitConfig {
  limit: number;
  windowSeconds: number;
}

export const RATE_LIMIT_POLICIES = {
  STRICT: { limit: 5, windowSeconds: 60 },      // 5 requests per minute (e.g. login attempts)
  AUTH: { limit: 10, windowSeconds: 60 },       // 10 requests per minute (e.g. refresh, OTP requests)
  GLOBAL: { limit: 100, windowSeconds: 60 },    // 100 requests per minute (general endpoints)
} as const;

/**
 * Checks if a key (usually IP + endpoint) has exceeded the rate limit.
 * Throws a TooManyRequestsError if limit is reached.
 */
export async function checkRateLimit(
  identifier: string,
  policy: keyof typeof RATE_LIMIT_POLICIES | RateLimitConfig
): Promise<void> {
  const config = typeof policy === 'string' ? RATE_LIMIT_POLICIES[policy] : policy;
  const key = `${SECURITY.REDIS_RATE_LIMIT_PREFIX}${identifier}`;

  try {
    const current = await redis.get(key);
    
    if (current && parseInt(current, 10) >= config.limit) {
      throw new TooManyRequestsError('Too many requests. Please try again later.');
    }

    // Increment count
    const count = await redis.incr(key);
    
    // Set expiry if first request in window
    if (count === 1) {
      await redis.expire(key, config.windowSeconds);
    }
  } catch (error: unknown) {
    // If it's our custom TooManyRequestsError, propagate it
    if (error instanceof TooManyRequestsError) {
      throw error;
    }
    
    // If it's a Redis error, print it but allow request to bypass rate limit
    // so cache issues don't crash the server API (fail-open strategy)
    console.error('Rate limiting Redis error (Failing open):', error instanceof Error ? error.message : String(error));
  }
}
