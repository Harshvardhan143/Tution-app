import Redis from 'ioredis';
import { env } from '@/config/env';

interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode?: string, duration?: number): Promise<'OK' | null>;
  del(key: string | string[]): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  flushall(): Promise<'OK'>;
}

// In-memory mock Redis client fallback
class MockRedisClient implements IRedisClient {
  private store = new Map<string, { value: string; expiry?: number }>();

  constructor() {
    console.warn('⚠️ Redis connection failed. Falling back to In-Memory Mock Cache.');
  }

  private isExpired(key: string): boolean {
    const item = this.store.get(key);
    if (!item) return true;
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key);
      return true;
    }
    return false;
  }

  async get(key: string): Promise<string | null> {
    if (this.isExpired(key)) return null;
    return this.store.get(key)?.value || null;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK' | null> {
    let expiry: number | undefined;
    if (mode === 'EX' && duration) {
      expiry = Date.now() + duration * 1000;
    }
    this.store.set(key, { value, expiry });
    return 'OK';
  }

  async del(key: string | string[]): Promise<number> {
    const keys = Array.isArray(key) ? key : [key];
    let count = 0;
    keys.forEach((k) => {
      if (this.store.has(k)) {
        this.store.delete(k);
        count++;
      }
    });
    return count;
  }

  async incr(key: string): Promise<number> {
    const val = await this.get(key);
    const num = val ? parseInt(val, 10) + 1 : 1;
    await this.set(key, num.toString());
    return num;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const val = await this.get(key);
    if (val === null) return 0;
    this.store.set(key, { value: val, expiry: Date.now() + seconds * 1000 });
    return 1;
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    const result: string[] = [];
    for (const key of this.store.keys()) {
      if (!this.isExpired(key) && regex.test(key)) {
        result.push(key);
      }
    }
    return result;
  }

  async flushall(): Promise<'OK'> {
    this.store.clear();
    return 'OK';
  }
}

// Global cached client instance for hot-reloads
interface RedisGlobal {
  client: IRedisClient | null;
}

declare global {
  var redisGlobal: RedisGlobal | undefined;
}

let cached = global.redisGlobal;
if (!cached) {
  cached = global.redisGlobal = { client: null };
}

if (!cached.client) {
  if (process.env.NODE_ENV === 'test') {
    cached.client = new MockRedisClient();
  } else {
    try {
      console.log('🔄 Connecting to Redis...');
      const redisInstance = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        connectTimeout: 2000,
        reconnectOnError: () => false,
      });

      redisInstance.on('connect', () => {
        console.log('✅ Redis connected successfully');
      });

      redisInstance.on('error', (err) => {
        console.error('❌ Redis connection error:', err.message);
        // Do not crash the application, fallback to memory
        if (!(cached!.client instanceof MockRedisClient)) {
          cached!.client = new MockRedisClient();
        }
      });

      // Attempt initial connection
      redisInstance.connect().catch((err) => {
        console.error('❌ Redis connection failed on startup:', err.message);
        cached!.client = new MockRedisClient();
      });

      cached.client = redisInstance as unknown as IRedisClient;
    } catch (e: unknown) {
      console.error('❌ Failed to instantiate Redis client:', e instanceof Error ? e.message : String(e));
      cached.client = new MockRedisClient();
    }
  }
}

export const redis = cached.client as IRedisClient;
