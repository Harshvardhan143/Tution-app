import { withApiHandler, successResponse } from '@/lib/api-utils';
import { redis } from '@/lib/server/redis';
import mongoose from 'mongoose';

/**
 * GET /api/health
 * Standard health check endpoint checking DB and Cache connectivity.
 */
export const GET = withApiHandler(async () => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  let redisStatus = 'disconnected';
  try {
    // Attempt a quick write/read or ping to test Redis
    await redis.set('health_check_ping', '1', 'EX', 5);
    const ping = await redis.get('health_check_ping');
    if (ping === '1') {
      redisStatus = 'connected';
    }
  } catch {
    redisStatus = 'error';
  }

  const payload = {
    status: dbStatus === 'connected' && redisStatus === 'connected' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: dbStatus,
      cache: redisStatus,
    },
    version: '1.0.0',
  };

  return successResponse(payload);
});
export const dynamic = 'force-dynamic';
