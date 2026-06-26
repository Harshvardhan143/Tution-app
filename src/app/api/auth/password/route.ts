import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { AuthService } from '@/services/auth-service';
import { getCurrentUser } from '@/lib/server/auth';

const passwordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

async function passwordHandler(req: NextRequest) {
  const user = await getCurrentUser(req);
  const body = await req.json();
  const parsed = passwordSchema.parse(body);

  await AuthService.changePassword(user.userId, parsed.oldPassword, parsed.newPassword);

  return successResponse(null, 'Password changed successfully', 200);
}

export const POST = withApiHandler(passwordHandler);
