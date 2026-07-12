import { NextRequest } from 'next/server';
import { withApiHandler, successResponse } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { getStaffDoubts, answerDoubt } from '@/services/doubt-service';
import { ROLES, HTTP_STATUS } from '@/config/constants';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const answerDoubtSchema = z.object({
  doubtId: z.string(),
  answer: z.string().min(1),
});

export const GET = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  const doubts = await getStaffDoubts(user.userId);
  return successResponse(doubts, 'Doubts fetched successfully');
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const user = await requireRole(req, [ROLES.STAFF]);
  
  const body = await req.json();
  const parsed = answerDoubtSchema.safeParse(body);
  
  if (!parsed.success) {
    throw new AppError('Invalid request body: ' + parsed.error.message, HTTP_STATUS.BAD_REQUEST);
  }

  const doubt = await answerDoubt(user.userId, parsed.data.doubtId, parsed.data.answer);
  
  return successResponse(doubt, 'Doubt answered successfully');
});
