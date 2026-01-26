import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  redisClient = createClient({
    url: redisUrl,
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  await redisClient.connect();

  return redisClient;
}

/**
 * Cache wrapper for any async function
 */
export async function withCache<T>(
  key: string,
  ttl: number, // Time to live in seconds
  fetchFn: () => Promise<T>
): Promise<T> {
  try {
    const client = await getRedisClient();

    // Try to get from cache
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    // Fetch fresh data
    const data = await fetchFn();

    // Store in cache
    await client.setEx(key, ttl, JSON.stringify(data));

    return data;
  } catch (error) {
    // If Redis fails, just fetch without cache
    console.error('Cache error, falling back to direct fetch:', error);
    return fetchFn();
  }
}

/**
 * Invalidate cache by key or pattern
 */
export async function invalidateCache(keyOrPattern: string): Promise<void> {
  try {
    const client = await getRedisClient();

    if (keyOrPattern.includes('*')) {
      // Pattern-based invalidation
      const keys = await client.keys(keyOrPattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } else {
      // Single key invalidation
      await client.del(keyOrPattern);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

/**
 * Session storage utilities
 */
export const sessionCache = {
  async set(sessionId: string, data: any, ttl: number = 3600): Promise<void> {
    const client = await getRedisClient();
    await client.setEx(`session:${sessionId}`, ttl, JSON.stringify(data));
  },

  async get<T>(sessionId: string): Promise<T | null> {
    const client = await getRedisClient();
    const data = await client.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  },

  async delete(sessionId: string): Promise<void> {
    const client = await getRedisClient();
    await client.del(`session:${sessionId}`);
  },

  async extend(sessionId: string, ttl: number = 3600): Promise<void> {
    const client = await getRedisClient();
    await client.expire(`session:${sessionId}`, ttl);
  },
};

/**
 * Rate limiting utilities
 */
export const rateLimiter = {
  async check(
    identifier: string,
    limit: number,
    windowSeconds: number
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: Date;
  }> {
    const client = await getRedisClient();
    const key = `ratelimit:${identifier}`;

    const current = await client.incr(key);

    if (current === 1) {
      await client.expire(key, windowSeconds);
    }

    const ttl = await client.ttl(key);
    const resetAt = new Date(Date.now() + ttl * 1000);

    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      resetAt,
    };
  },
};

export default {
  getRedisClient,
  withCache,
  invalidateCache,
  sessionCache,
  rateLimiter,
};
