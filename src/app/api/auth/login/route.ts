import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { AuthService } from '@/services/auth-service';

const loginSchema = z.object({
  emailOrUsername: z.string().min(3),
  password: z.string().min(1),
});

async function loginHandler(req: NextRequest) {
  const body = await req.json();
  const parsed = loginSchema.parse(body);

  const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';

  const result = await AuthService.login(parsed.emailOrUsername, parsed.password, ipAddress);

  return successResponse(result, 'Login successful', 200);
}

export const POST = withApiHandler(loginHandler);
