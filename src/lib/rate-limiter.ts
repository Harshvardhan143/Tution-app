import { SECURITY } from '@/config/constants';
import { TooManyRequestsError } from './errors';

export interface RateLimitConfig {
  limit: number;
  windowSeconds: number;
}

export const RATE_LIMIT_POLICIES = {
  STRICT: { limit: 5, windowSeconds: 60 },
  AUTH: { limit: 10, windowSeconds: 60 },
  GLOBAL: { limit: 100, windowSeconds: 60 },
} as const;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

// Simple background garbage collection every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (now > entry.resetAt) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref();
}

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

  const now = Date.now();
  let entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + config.windowSeconds * 1000 };
  }

  if (entry.count >= config.limit) {
    throw new TooManyRequestsError('Too many requests. Please try again later.');
  }

  entry.count++;
  memoryStore.set(key, entry);
}
