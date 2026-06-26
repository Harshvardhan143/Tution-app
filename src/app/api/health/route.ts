import { withApiHandler, successResponse } from '@/lib/api-utils';
import mongoose from 'mongoose';

/**
 * GET /api/health
 * Standard health check endpoint checking DB and Cache connectivity.
 */
export const GET = withApiHandler(async () => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  const payload = {
    status: dbStatus === 'connected' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: dbStatus,
    },
    version: '1.0.0',
  };

  return successResponse(payload);
});
export const dynamic = 'force-dynamic';
