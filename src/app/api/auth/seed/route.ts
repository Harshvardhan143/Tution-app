
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { AuthService } from '@/services/auth-service';

async function seedHandler() {
  // Normally, this should be protected behind a super-admin or dev-only flag.
  // For demo purposes, we will allow it if the database is not already seeded.
  const result = await AuthService.seed();
  return successResponse(result, 'Seed process completed', 200);
}

export const POST = withApiHandler(seedHandler);
