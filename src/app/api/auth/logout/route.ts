import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { AuthService } from '@/services/auth-service';
import { getCurrentUser } from '@/lib/server/auth';

const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

async function logoutHandler(req: NextRequest) {
  const user = await getCurrentUser(req);
  
  const body = await req.json().catch(() => ({}));
  const parsed = logoutSchema.parse(body);

  await AuthService.logout(user.jti, parsed.refreshToken);

  return successResponse(null, 'Logged out successfully', 200);
}

export const POST = withApiHandler(logoutHandler);
