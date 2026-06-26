import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { AuthService } from '@/services/auth-service';

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

async function refreshHandler(req: NextRequest) {
  const body = await req.json();
  const parsed = refreshSchema.parse(body);

  const result = await AuthService.refresh(parsed.refreshToken);

  return successResponse(result, 'Token refreshed', 200);
}

export const POST = withApiHandler(refreshHandler);
