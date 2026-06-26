import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { AuthService } from '@/services/auth-service';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

async function forgotPasswordHandler(req: NextRequest) {
  const body = await req.json();
  const parsed = forgotPasswordSchema.parse(body);

  await AuthService.requestPasswordReset(parsed.email);

  return successResponse(null, 'If an account exists, a password reset email has been sent', 200);
}

export const POST = withApiHandler(forgotPasswordHandler);
